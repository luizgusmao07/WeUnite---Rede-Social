/* eslint-disable react/prop-types */

import {
    Box, Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useColorMode
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../../atoms/postsAtom";

const Actions = ({ post }) => {
    // Estado global e informações do usuário
    const user = useRecoilValue(userAtom);
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();

    const { colorMode } = useColorMode();//Mudei

    /**
     * Manipula a funcionalidade de curtir/descurtir uma publicação.
     */
    const handleLikeAndUnlike = async () => {
        if (!user) {
            return showToast('Erro', 'Você precisa estar logado para curtir uma publicação', 'error');
        }
        if (isLiking) return;

        setIsLiking(true);

        try {
            const res = await fetch(`/api/posts/like/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.error) {
                return showToast("Erro", data.error, 'error');
            }

            // Atualiza o estado dos posts com o novo status de curtida
            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return {
                        ...p,
                        likes: liked
                            ? p.likes.filter((id) => id !== user._id)
                            : [...p.likes, user._id]
                    };
                }
                return p;
            });

            setPosts(updatedPosts);
            setLiked(!liked);
        } catch (error) {
            showToast("Erro", error.message, 'error');
        } finally {
            setIsLiking(false);
        }
    };

    /**
     * Manipula a publicação de uma resposta.
     */
    const handleReply = async () => {
        if (!user) {
            return showToast('Erro', 'Você precisa estar logado para comentar em uma publicação', 'error');
        }
        if (isReplying) return;

        setIsReplying(true);

        try {
            const res = await fetch(`/api/posts/reply/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: reply }),
            });

            const data = await res.json();

            if (data.error) {
                return showToast("Erro", data.error, 'error');
            }

            // Atualiza o estado dos posts com a nova resposta
            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });

            setPosts(updatedPosts);
            showToast("Sucesso", "Comentário publicado com sucesso", "success");
            onClose();
            setReply("");
        } catch (error) {
            showToast("Erro", error.message, 'error');
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <>
            {/* Seção de ações */}
            <Flex mt={5} flexDir="column" onClick={(e) => e.preventDefault()}>
                <Flex gap={4}>
                    {/* Botão de Curtir */}
                    <svg
                        aria-label='Like'
                        color={liked ? "rgb(237, 73, 86)" : ""}
                        fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                        height='19'
                        role='img'
                        viewBox='0 0 24 22'
                        width='20'
                        onClick={handleLikeAndUnlike}
                        cursor="pointer"
                    >
                        <path
                            d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
                            stroke='currentColor'
                            strokeWidth='2'
                        ></path>
                    </svg>

                    {/* Botão de Repostar */}
                    <svg
                        aria-label='Repost'
                        color={""}
                        fill={"currentColor"}
                        height='20'
                        role='img'
                        viewBox='0 0 24 24'
                        width='20'
                        cursor="pointer"
                    >
                        <title>Repost</title>
                        <path
                            d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
                        ></path>
                    </svg>

                    {/* Botão de Comentário */}
                    <svg
                        aria-label='Comment'
                        height='20'
                        role='img'
                        viewBox='0 0 24 24'
                        width='20'
                        onClick={onOpen}
                        cursor="pointer"
                    >
                        <title>Comment</title>
                        <path
                            d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
                            fill='none'
                            stroke='currentColor'
                            strokeLinejoin='round'
                            strokeWidth='2'
                        ></path>
                    </svg>
                </Flex>
            </Flex>

            {/* Estatísticas do Post */}
            <Flex gap={3} mt={2}>
                <Text color="#959595" fontSize='sm'>
                    {post.likes.length} likes
                </Text>
                <Flex alignItems="center" justifyContent="center">
                    <Box w={1} h={1} borderRadius="full" bg="#959595" />
                </Flex>
                <Text color="#959595" fontSize='sm'>
                    {post.replies.length} replies
                </Text>
            </Flex>

            {/* Modal de Comentário */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    bg={colorMode === "dark" ? "black" : "gray.100"} //Mudei 
                    color={colorMode === "dark" ? "white" : "black"} //Mudei
                >
                    <ModalHeader>Comentar</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input
                                placeholder='Escreva aqui seu comentário'
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                focusBorderColor="#03C03C"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            mr={3}
                            onClick={handleReply}
                            isLoading={isReplying}
                            bg="#03C03C"
                            color="#000000"
                        >
                            Comentar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Actions;