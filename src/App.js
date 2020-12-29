import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
const [data,setData] = useState([{}]);
const [total,setTotal] = useState(0);
var febData = [{}];

const getData = async() => {
//Fetching data from mock-server(JSON-SERVER) running on 8080 port - Copied data from http://34.198.81.140/attendance.json to local db.json() file.
axios.get('http://localhost:8000/data').then((result) => {
  setData(result.data);
}).catch((err) => console.log(err));
}
useEffect(() => {
  getData();
},[])



const evaluateFunc = () => {

  //Filter data for Feb month only (index are from 1143 to 4317).
  let febdata;
  for(var i = 1143; i<= 4317; i++){
    febdata = data[i];
    febData.push(febdata);   //Storing data into global variable.
  } 

  let femaleWorker = 0;
  let femaleNonWorker = 0;
  let maleWorker = 0;
  let maleNonWorker = 0;

// Calculate the salary for month of feb (Note 0 index is empty therefore started loop from 1)
 for(var w = 1; w<febData.length; w++){

  const typeOfEmployee = febData[w].designation;
  const gender = febData[w].gender;
  const weekday = febData[w].weekday;
  const perDayHours = febData[w].total_hours;
  const perDaySal = febData[w].per_day_salary;

  //Segregating employees


  if(typeOfEmployee === "Worker" && gender === "Female"){
 
              if(perDayHours>=8){
                const overtimeHours = perDayHours-8;
                const overtimeSalary = overtimeHours*2*perDaySal;
                femaleWorker = femaleWorker+perDaySal+overtimeSalary;
              }
            else if(perDayHours<8){
              //half day
              femaleWorker = femaleWorker+perDaySal/2;
            }
            else if(perDayHours<4){
              //absent
              femaleWorker = femaleWorker+0;
            }
  }
  else if(typeOfEmployee === "Worker" && gender === "Male"){
   
    if(perDayHours>=8){
      const maleOvertimeHours = perDayHours - 8;
      const maleOvertimeSal = maleOvertimeHours*2*perDaySal;
      maleWorker = maleWorker+perDaySal+maleOvertimeSal;
      }
    else if(perDayHours<8){
      //half day
      maleWorker = maleWorker+perDaySal/2;
    }
    else if(perDayHours<4){
      maleWorker = maleWorker+0;
    }
  }
  else if(typeOfEmployee !== "Worker" && gender === "Female"){
  
    if(weekday != 7 && weekday != 1){
      //Only from Mon-Fri
              if(perDayHours>=8){
                //calculate -(No Overtime)
                femaleNonWorker = femaleNonWorker+perDaySal;
                }
              else if(perDayHours<8){
                femaleNonWorker =  femaleNonWorker + perDaySal/2;
              }
              else if(perDayHours<4){
                femaleNonWorker = femaleNonWorker+ 0;
              }
    }
  }
  else{
    if(weekday != 7 && weekday != 1){
    

      //Only from Mon-Fri
              if(perDayHours>=8){
                //calculate
                maleNonWorker = maleNonWorker+perDaySal;
                }
              else if(perDayHours<8){
                maleNonWorker = maleNonWorker + perDaySal/2;
              }
              else if(perDayHours<4){
                maleNonWorker = maleNonWorker + 0;
              }
    }
  }

 }

 //Bonus
 let bonus;
 //Total Female Salaries
 var totalFemaleSalaryOfMonth = femaleWorker+femaleNonWorker;
 console.log("Total Female Salary",totalFemaleSalaryOfMonth);
//Total Male Salaries
var totalMaleSalaryOfMonth = maleWorker+maleNonWorker;
console.log("Total Male Salary",totalMaleSalaryOfMonth);

//Bonus Logic
if(totalFemaleSalaryOfMonth<totalMaleSalaryOfMonth){
   bonus = 0.01*totalFemaleSalaryOfMonth;
   console.log(" Female Bonus",bonus);
   totalFemaleSalaryOfMonth = totalFemaleSalaryOfMonth+bonus;
}
else{
  bonus = 0.01*totalMaleSalaryOfMonth
  console.log("Male Bonus",bonus);
  totalMaleSalaryOfMonth = totalMaleSalaryOfMonth+bonus;
}

//Total Salary of month Feb
const totalSal = totalMaleSalaryOfMonth+totalFemaleSalaryOfMonth;
//output salary;
setTotal(totalSal);
}


  return (
    <div className="App">
     <p>Monthly salary would be</p>
     <button onClick={evaluateFunc}>Evaluate</button>
     <div>Total Salary for the month is : {total}</div>
    </div>
  );
}

export default App;
