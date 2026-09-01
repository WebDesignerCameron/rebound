/* Interpret a rebound file */
try {
    document.getElementById("execute").addEventListener("click", ()=>{
        /* Text and array variables */
        const file = document.querySelector("input[type=file]").files[0];
        const text = await file.text();
        const lines = text.split(/\r?\n/);
        let line;
        let words;
        let word;
        /* Run-time variables */
        let printMode = false;
        let commentMode = false;
        let output = "";
        for(n1 = 0; n1 < lines.length; n1++){
            line = lines[n1];
            words = line.split(" ");
            for(n2 = 0; n2 < words.length; n++){
                if(!commentMode){
                    if(printMode){
                        output += word;
                    }else if(word == "//"){
                        commentMode = true;
                    }else if(word == "note"){
                        printMode = true;
                    }
                }else{
                    continue;
                }
            };
            /* Reset variables */
            printMode = false;
            commentMode = false;
        };
        document.getElementById("outputBox").textContent = output;
    });
}catch(error){
    window.alert("An error has occured! It says: " + error.message);
}
