let promptMessage = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imageBtn=document.querySelector("#image");
let image=document.querySelector("#image img");
let imageInput =document.querySelector("#image input")


const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDLCjq2NFDPFewPZsBbYJ198CF-QsTZyaM";


let user={
    message:null,
    file:{
         mime_type:null,
        data: null
    }
}
function textGenerator(){
    async function generateResponse(aiChatBox) {
        let text=aiChatBox.querySelector(".ai-chat-area")
         let requestOption={
            method:"post",
            headers:{'Content-Type': 'application/json'} ,
            body:JSON.stringify({
                "contents":[
                    {"parts":[{"text":user.message},(user.file.data?[{"inline_data":user.file}]:[])
        
                    ]}
                ]
            })
         }
        try{
            let response = await fetch(Api_Url,requestOption)
            let data=await response.json()
         let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
           text.innerHTML=apiResponse
        }
        catch(error){
            console.log(error);
            
        }
        finally{
            chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
            image.src=`image.svg`
            image.classList.remove("choose")
            user.file={}
        }
        
         
        }
        
        
        function createChatBox(html, classes) {
          let div = document.createElement("div");
          div.innerHTML = html;
          div.classList.add(classes);
          return div;
        }
        
        
        
        function handleChatResponse(userMessage) {
            user.message=userMessage
          let html = `  <div class="user-chat-box">
                    <img src="./user.png" alt="" srcset="" id="userImage" width="8%">
                    <div class="user-chat-area">
                     ${user.message}
                     ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseImg" />` : ""}
                    </div>
                </div>`;
                promptMessage.value="";
          let userChatBox = createChatBox(html, "user-Chat-Box");
          chatContainer.appendChild(userChatBox);
          chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        
          setTimeout(()=>{
        let html=` <div class="ai-chat-box">
                    <img src="./ai.png" alt="" srcset="" id="aiImage" width="8%">
                    <div class="ai-chat-area">
                       <img src="./loading.webp" alt="" class="load" width="50px">
                    </div>
                </div>`
                let aiChatBox=createChatBox(html,"ai=chat-box");
                chatContainer.appendChild(aiChatBox);
                generateResponse(aiChatBox)
        
          },600)
        }
        
        
        
        
        promptMessage.addEventListener("keydown", (e) => {
          if (e.key == "Enter") {
            handleChatResponse(promptMessage.value);
          }
        });
        
        submitbtn.addEventListener("click",()=>{
            handleChatResponse(promptMessage.value);
        })
}
textGenerator()


imageInput.addEventListener("change",()=>{
    const file=imageInput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let imageString=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
           data: imageString
       }
      image.src=`data:${user.file.mime_type};base64,${user.file.data}`
      image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})
imageBtn.addEventListener("click",()=>{
    imageInput.click()
})