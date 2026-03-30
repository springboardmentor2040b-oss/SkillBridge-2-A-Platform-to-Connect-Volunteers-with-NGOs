import React, { useState, useEffect } from "react";

function Messages(){

const storedUser = JSON.parse(localStorage.getItem("user"));

const [messages,setMessages] = useState([]);
const [message,setMessage] = useState("");

const NGO_ID = "ngo123"; // you can replace with real NGO id

useEffect(()=>{

fetch(`http://localhost:5000/api/messages/${storedUser._id}/${NGO_ID}`)
.then(res=>res.json())
.then(data=>setMessages(data));

},[]);

const sendMessage = async ()=>{

if(message==="") return;

const newMessage = {
senderId: storedUser._id,
receiverId: NGO_ID,
senderRole: storedUser.role,
message
};

const res = await fetch("http://localhost:5000/api/messages/send",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body: JSON.stringify(newMessage)
});

const data = await res.json();

setMessages([...messages,data]);

setMessage("");

};

return(

<div className="p-8">

<h2 className="text-2xl font-bold mb-4">Chat with NGO</h2>

<div className="border h-96 overflow-y-scroll p-4 mb-4 bg-gray-50">

{messages.map((msg)=>(
<div
key={msg._id}
className={`mb-2 ${
msg.senderId===storedUser._id ? "text-right" : "text-left"
}`}
>

<span className="bg-blue-100 p-2 rounded inline-block">
{msg.message}
</span>

</div>
))}

</div>

<div className="flex gap-2">

<input
className="border p-2 flex-1"
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Type your message"
/>

<button
onClick={sendMessage}
className="bg-blue-500 text-white px-4 py-2"
>
Send
</button>

</div>

</div>

);

}

export default Messages;