{
var proceedToUpload = false;
document.getElementById("authent").innerHTML="Status: NOT AUTHENTICATED: DO NOT UPLOAD";
document.getElementById("statusUp").innerHTML="Not Uploaded";
document.getElementById("enterPass").innerHTML="Enter Testing Coordinator PIN To Authenticate Before Uploading File";
let submit = document.getElementById("submit");
let fileButton = document.getElementById("fileButton");
const final = "27630.854545454545454513";
let checkAuth = false;
fileButton.addEventListener('click',(upFile)=>{
    if(checkAuth==false){
       document.getElementById("enterPass").innerHTML= "PLEASE ENTER PIN BEFORE UPLOADING";
       //prevents file upload when not authenticated
       upFile.preventDefault();
    
    }    
})
function startUp(){
    let enteredPass = document.getElementById("PIN").value;
    let crypt1 = (enteredPass + parseInt("002F",16)/55); 
    let crypt2 = ((crypt1).toString(8));
    let crypt3 = (crypt2+13).toString(2);
    
    //UPLOAD LOCATION IN SERVER
    var whichSubject;
    //posts upload location to UI
    var stringSubject;
    

    if (crypt3==final){
        
       checkAuth= true;
       document.getElementById("authent").innerHTML="SUCCESSFULLY AUTHENTICATED:SELECT TEST TYPE AND UPLOAD";
       document.getElementById("enterPass").innerHTML="CORRECT PASSWORD ENTERED";
       fileButton.addEventListener('change',(e)=>{
           
           //checks where to upload file to
           if(document.getElementById("English 1").checked == true){
                //english 1
               whichSubject= "eng1.csv";
            
               stringSubject = "English 1";
            }
            else if(document.getElementById("US History").checked == true){
                //history
                whichSubject = "ushistory.csv";
               
                stringSubject = "US History";
            }
            else if(document.getElementById("Biology").checked == true){
                //biology
                whichSubject = "biology.csv";
             
                stringSubject = "Biology";
            }
            else if(document.getElementById("Algebra").checked == true){
                //algebra
                whichSubject = "algebra.csv";
               
                stringSubject = "Algebra";
            }
            else if(document.getElementById("English 2").checked == true){
                //english 2
                whichSubject = "eng2.csv";
                
                stringSubject = "English 2";
            }
           else{
               document.getElementById("statusUp").innerHTML=("ERROR: NO TEST TYPE SELECTED, TRY AGAIN");
           }
            //get file
            let file = e.target.files[0];
          
            let reader = new FileReader();
            reader.addEventListener("loadend",()=>{
                let pairs = reader.result.split(/\r\n/);
                let endGame = 0;
                let whichLines = [];
                for (let i = 0; i< pairs.length;i++){
                    
                    if (/^[0-9]{6}\,[a-dA-d][0-9]{3}$/.test(pairs[i])== false){
                       endGame++;
                       whichLines.push(i+1);
                        
                        
                    }
                    
                }
                if(endGame>0){
                     document.getElementById("statusUp").innerHTML= ('File is incorrectly formatted: Ensure that you are uploading a 2 column Excel file with the first column containing 6 digit student ID numbers and the second containing room numbers with one letter followed by three numbers. Check that no extraneous spaces are present. Rows ' + errorSpots(whichLines) + "of the Excel file have errors. Refresh the page before trying to upload again.");
                }
                else{
                    proceedToUpload();
                }
                
                 function errorSpots(whereTo){
                    var lookHere =" ";
                    var punctuation;
                    for(let index = 0; index<whereTo.length; index++){
                        if(lookHere === " "){
                            punctuation = " "
                        }
                        else{
                            punctuation = ", "}
                        lookHere = (whereTo[index] + punctuation + lookHere );
                }
                    console.log(lookHere);
                    return lookHere;
               
           } 
             
            });
           reader.readAsText(file);
          
           function proceedToUpload(){
                //storage reference
                let storageRef = firebase.storage().ref(whichSubject);
                console.log(whichSubject)
            
                //complete upload
                let task = storageRef.put(file);
           
            
                task.on('state_changed',(snapshot)=>{
                    let percentage = ((snapshot.bytesTransferred / snapshot.totalBytes)*100);
                    if(percentage = 100){
                        document.getElementById("statusUp").innerHTML=('UPLOADED TO ' + stringSubject+ ', Refresh Page to Upload Another File');
                    }
                });   
            }
        });
    }
    else{
        document.getElementById("enterPass").innerHTML="INCORRECT PASSWORD, TRY AGAIN";
    }
}
}



