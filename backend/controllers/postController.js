import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";
import { v2 as cloudinary } from "cloudinary"
import { createNotification } from "./notificationController.js";

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { mediaUrl, mediaType } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ error: "Postedby e texto são obrigatórios" });
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Não autorizado a criar publicação" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `O texto deve ter menos que ${maxLength} caracteres` });
        }

        let uploadedUrl = null;

        if (mediaUrl) {
            const uploadOptions = {
                resource_type: mediaType === 'video' ? 'video' : 'image',
                // Configurações específicas para vídeo
                ...(mediaType === 'video' && {
                    chunk_size: 6000000, // tamanho do chunk para upload
                    eager: [
                        { width: 720, height: 480, crop: "pad", audio_codec: "none" },
                        { width: 480, height: 320, crop: "pad", audio_codec: "none" }
                    ],
                    eager_async: true
                })
            };

            const uploadedResponse = await cloudinary.uploader.upload(mediaUrl, uploadOptions);
            uploadedUrl = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            postedBy,
            text,
            ...(mediaType === 'image' && { img: uploadedUrl }),
            ...(mediaType === 'video' && { video: uploadedUrl }),
            mediaType: mediaUrl ? mediaType : 'none'
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete post " });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            //Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "Post unliked successfully" });

        } else {
            //Like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });

            await createNotification(post.postedBy, 'like', postId, userId);
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};
const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const reply = { userId, text, userProfilePic, username };

        post.replies.push(reply);
        await post.save();

        await createNotification(post.postedBy, 'comment', postId, userId);

        res.status(200).json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const following = user.following;

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json(feedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserComments = async (req, res) => {
    try {
        const { username } = req.params;

        // Encontrar o usuário pelo nome de usuário
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Encontrar todas as publicações que contêm comentários do usuário, excluindo suas próprias publicações
        const posts = await Post.find({
            'replies.userId': user._id,
            'postedBy': { $ne: user._id } // Filtra para publicações feitas por outros usuários
        });

        const postUserIds = [...new Set(posts.map(post => post.postedBy.toString()))];
        const postUsers = await User.find({ _id: { $in: postUserIds } });
        const postUsersMap = postUsers.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        // Extrair apenas os comentários do usuário de todas as publicações
        const userComments = posts.flatMap(post =>
            post.replies.filter(reply => reply.userId.toString() === user._id.toString())
                .map(reply => ({
                    postId: post._id,
                    commentId: reply._id,
                    text: reply.text,
                    profilePic: reply.userProfilePic,
                    postAuthorName: postUsersMap[post.postedBy.toString()] || 'Desconhecido'
                }))
        );

        // Ordenar os comentários por data de criação (do mais recente para o mais antigo)
        userComments.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json(userComments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        // Encontrar o post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }

        // Encontrar o comentário
        const comment = post.replies.id(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comentário não encontrado" });
        }

        // Verificar se o usuário é o autor do comentário
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Não autorizado a excluir este comentário" });
        }

        // Remover o comentário usando o método pull()
        post.replies.pull(commentId);

        // Salvar o post atualizado
        await post.save();

        res.status(200).json({ message: "Comentário excluído com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, getUserComments, deleteComment, }