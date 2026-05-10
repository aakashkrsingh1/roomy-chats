import {React, useState} from "react";
import chatIcon from "../assets/chatIcon.png"
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
    const [detail, setDetail] = useState({
        roomId: '',
        userName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { setRoomId, setCurrentUser, setConnected } = useChatContext();
    const navigate = useNavigate();

    function handleFormInputChange(event){
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,
        });
    }
    function validateForm(){
        if(detail.roomId ==="" || detail.userName===""){
            toast.error("Invalid Input!")
            return false;
        }
        return true;
    }
   async function joinChat(){
        if(validateForm()){
            setIsLoading(true);
            try {
                const room = await joinChatApi(detail.roomId);
                toast.success("Joined successfully!");
                setCurrentUser(detail.userName);
                setRoomId(room.roomId);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                const status = error?.response?.status;
                if(status === 400){
                    toast.error(error?.response?.data || "Room not found!");
                } else {
                    toast.error("Error in Joining room.");
                }
                console.log("Error in Joining room:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }

   async function createRoom(){
        if(validateForm()){
            setIsLoading(true);
            try {
                const response =  await createRoomApi(detail.roomId);
                console.log(response);
                toast.success("Room Created Successfully!");
                setCurrentUser(detail.userName);
                setRoomId(detail.roomId);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                console.log(error);
                const status = error?.response?.status;
                if(status === 400){
                    toast.error(error?.response?.data || "Room already exists!");
                } else {
                    toast.error("Error in creating room");
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative">
                <div className="p-8 retro-card rounded-3xl text-center max-w-md w-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-300 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold retro-title mb-4">Loading Roomy Chat...</h2>
                    <p className="text-sm retro-subtitle">
                        The backend is waking up. This might take up to two minutes for the first request.
                        Subsequent operations will be much faster.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-10">
            <div className="p-8 retro-card rounded-[32px] shadow-xl w-full max-w-md transition-transform duration-300 ease-in-out hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                    <img className="w-24 h-24 object-contain" src={chatIcon} alt="Roomy Chat Icon" />
                </div>
                <h1 className="text-3xl font-bold text-center retro-title mb-2">Roomy Chat</h1>
                <p className="text-center retro-subtitle mb-8">Join or Create a Room</p>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium retro-subtitle mb-2">Your Name</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={detail.userName}
                            onChange={handleFormInputChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 retro-input rounded-xl focus:outline-none transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium retro-subtitle mb-2">Room ID</label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            value={detail.roomId}
                            onChange={handleFormInputChange}
                            placeholder="Enter room ID"
                            className="w-full px-4 py-3 retro-input rounded-xl focus:outline-none transition-all duration-300"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                            onClick={joinChat}
                            className="px-6 py-3 retro-btn retro-btn-primary rounded-full"
                        >
                            Join
                        </button>
                        <button
                            onClick={createRoom}
                            className="px-6 py-3 retro-btn retro-btn-secondary rounded-full"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <footer className="mt-8 text-center text-sm text-gray-400">
                <p>
                    Developed by{' '}
                    <a
                        href="https://www.linkedin.com/in/akash-kumar-singh-180a4916b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="retro-footer-link transition-colors duration-300"
                    >
                        Akash KS
                    </a>{' '}
                    |{' '}
                    <a
                        href="https://github.com/aakashkrsingh1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="retro-footer-link transition-colors duration-300"
                    >
                        GitHub
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default JoinCreateChat;