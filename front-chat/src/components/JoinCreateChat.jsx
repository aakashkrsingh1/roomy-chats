import {React,useState} from "react";
import chatIcon from "../assets/chatIcon.png"
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () =>{
    const [detail, setDetail] = useState({
        roomId: '',
        userName: '',
    });

    const {roomId, userName, connected, setRoomId, setCurrentUser, setConnected}=useChatContext();
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
            //join chat
            try {
                const room = await joinChatApi(detail.roomId);
                toast.success("Joined successfully!");
                setCurrentUser(detail.userName);
                setRoomId(room.roomId);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                if(error.status==400){
                    toast.error(error.response.data);
                }
                toast.error("Error in Joining room.");
                console.log("Error in Joining room.")
            }
            console.log(detail);
        }
    }

   async function createRoom(){
        if(validateForm()){
            //create room
            try {
              const response =  await createRoomApi(detail.roomId);
              console.log(response);
              toast.success("Room Created Successfully!");
              setCurrentUser(detail.userName);
              setRoomId(detail.roomId);
              setConnected(true);
              navigate("/chat");
              //forward to chat page
            } catch (error) {
                console.log(error);
                if(error.status ===400){
                    toast.error("Room already exists!");
                }
                console.log("Error in creating room") ;
            }
            console.log(detail);
            //call api to create room on backend

        }
    }
return <div className="min-h-screen flex items-center justify-center"> 
    <div className="p-10 dark:border-gray-800 w-full flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <div className="dark:bg-gray-500 flex gap-5 rounded justify-center rounded-full">
            <img className="mb-2 w-24 justify-center" src={chatIcon}></img>
        </div>
        <h1 className="text-2xl font-semibold text-center"> 
            Join / Create Room </h1>
            {/* Name Div */}
            <div className="">
                <label htmlFor="name" className="block font-medium mb-2">
                    Name
                </label>
                <input type="text"
                onChange={handleFormInputChange}
                value = {detail.userName}
                id="name"
                name="userName"
                placeholder="Enter the name"
                className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-600 rounded focus:none focus:ring-2 focus:ring-blue-500 ">
                </input>
            </div>
            {/* Room ID Div */}
            <div className="">
                <label htmlFor="name" className="block font-medium mb-2">
                    Enter Room-ID
                </label>
                <input type="text"
                name="roomId"
                onChange={handleFormInputChange}
                value={detail.roomId}
                id="name"
                placeholder="Enter the room id"
                className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-600 rounded focus:none focus:ring-2 focus:ring-blue-500 ">
                </input>
            </div>
            {/* Join Room Button */}
            <div className="flex gap-2 justify-center mt-4">
                <button onClick={joinChat} className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full">
                    Join
                </button>
                <button  onClick={createRoom} className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full">
                    Create
                </button>
            </div>
    </div>

</div>
};


export default JoinCreateChat;