/* Interpret a rebound file */
try {
    document.getElementById("execute").addEventListener("click", async ()=>{
        /* Text and array variables */
        const file = document.querySelector("input[type=file]").files[0];
        const text = await file.text();
        const lines = text.split(/\r?\n/);
        let line;
        let words;
        let word;
        /* Run-time variables */
        let mode = "None";
        let output = "";
        for(let n1 = 0; n1 < lines.length; n1++){
            line = lines[n1];
            words = line.split(" ");
            for(let n2 = 0; n2 < words.length; n2++){
                word = words[n2];
                if(mode != "commentMode" && mode != "multiCommentMode"){
                    if(mode == "printMode"){
                        let processed_word = word
                            .replace(/\\n/g, "<br>")
                            .replace(/\\t/g, "<span style='margin-left: 4em;'></span>");
                        output += processed_word + " ";
                    }else if(word == "//"){
                        mode = "commentMode";
                    }else if(word == "/*"){
                        mode = "multiCommentMode";
                    }else if(word == "note"){
                        mode = "printMode";
                    }
                }else{
                    if(word == "*/"){
                        mode = "None";
                    }
                }
            };
            /* Reset variables */
            if(mode != "multiCommentMode"){
                mode = "None";
            }
        };
        const outputbox = document.getElementById("outputBox");
        outputbox.innerHTML = output;
    });
}catch(error){
    window.alert("An error has occurred! It says: " + error.message);
}
