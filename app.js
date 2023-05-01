///// Selectors
const myBalance = document.querySelector(".balanceAmount");
const ttlSpending = document.querySelector(".totalAmount");
const numOfDays = document.querySelector(".day_count");
const percChange = document.querySelector(".changeAmount");
const percSymbol = document.querySelector(".percSymbol");
const graph = document.querySelector(".graphs");
const barSection = document.querySelector(".bars_wrapper");
const daySection = document.querySelector(".days_wrapper");
const aboveBar = document.querySelector(".bar");

/////Fetch API: JSON data
fetch("data.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (obj) {
    let data = obj;

    //Updates "My Balance" field in HTML
    let prevMonthBal; //I created this in case required for future functionality
    const updateMyBalance = function (newBalance) {
      let updatedBalance = Number(newBalance.toFixed(2));
      myBalance.innerHTML = updatedBalance;
    };
    updateMyBalance(921.48); //Using Example Data

    //Updates "Total this month" field in HTML
    const updateTtlMonthlySpending = function (newTotal) {
      let updatedTtlSpending = Number(newTotal.toFixed(2));
      ttlSpending.innerHTML = updatedTtlSpending;
    };

    //Calculates Total "Amount" from JSON file
    let jsonTotalAmount = 0;
    const calcJsonTotalAmount = function () {
      for (let i = 0; i < data.length; i++) {
        jsonTotalAmount = jsonTotalAmount + data[i].amount;
      }
      updateTtlMonthlySpending(jsonTotalAmount);
    };
    calcJsonTotalAmount();

    //Updates "from last month" field in HTML
    //This is the difference between previous months total spending and this months - returned as a percentage
    let prevTtlMonthlySpending; //Update this with real information
    prevTtlMonthlySpending = 466.85; //Example data
    let currMonthlySpending = 478.33; //Example data
    // Would need to add a new JSON file with increased data and make a funcitno to calc this.
    const updatePercMonthlyChange = function (currentMonthsTotalSpending) {
      let currentMonthsTotal = Number(currentMonthsTotalSpending.toFixed(2));
      prevTtlMonthlySpending = Number(prevTtlMonthlySpending.toFixed(2));
      let monthlyDiff = currentMonthsTotal - prevTtlMonthlySpending;
      let monthlyAvg = (currentMonthsTotal + prevTtlMonthlySpending) / 2;
      let monthlyChange = monthlyDiff / monthlyAvg;
      let monthlyChangePerc = monthlyChange * 100; //converting to a percentage
      percChange.innerHTML = monthlyChangePerc.toFixed(1);
      if (monthlyChangePerc.toFixed(1) > 0) {
        percSymbol.innerHTML = "+";
      } else if (monthlyChangePerc.toFixed(1) == 0 || "") {
        percSymbol.innerHTML = "";
      } else if (monthlyChangePerc.toFixed(1) < 0) {
        percSymbol.innerHTML = "-";
      }
    };
    updatePercMonthlyChange(currMonthlySpending);

    //Adds the Total Number of Days to the Spending Header in HTML
    numOfDays.innerHTML = data.length;

    /////Graphs
    //Create #  of bars == to number of days provided
    // let newBar = barSection.createElement("div");
    for (let barnum = 0; barnum < data.length; barnum++) {
      let newBar = document.createElement("div");
      newBar.classList.add("bar");
      newBar.classList.add(`bar${barnum}`);
      newBar.setAttribute(`id`, `bar${barnum}`); // This is for updating the current day backGround color
      newBar.style.height = `${data[barnum].amount * 1.5}%`; //adjust height == amount as a percentage
      let newBubble = document.createElement("div");
      newBubble.classList.add("dayAmount"); // for the text bubble with hover of the days total amount
      newBubble.classList.add(`dayAmount${barnum}`); // for the text bubble with hover of the days total amount
      //Set amount in the bubble above the bar
      newBubble.innerHTML = `$${data[barnum].amount}`;
      barSection.appendChild(newBar);
      document.querySelector(`.bar${barnum}`).appendChild(newBubble);
    }
    ////Change color of the current day of the week to blue
    //Dynamically determine current say of the week.
    let currentDate = new Date();
    let currentDay = currentDate.getDay();
    //   //Select Bar to Change color and Set bar to new color
    let currentDayBar = document.querySelector(`#bar${currentDay}`);
    console.log(currentDayBar);
    document.querySelector(
      `#bar${currentDay}`
    ).style.backgroundColor = `var(--cyan)`;
    // change opacity upon hover
    currentDayBar.addEventListener("mouseover", () => {
      currentDayBar.style.backgroundColor = `hsl(186, 34%, 60%, 0.5)`;
    });
    currentDayBar.addEventListener("mouseout", () => {
      currentDayBar.style.backgroundColor = `hsl(186, 34%, 60%)`;
    });

    //Create # of days == to number of days provided
    for (let daynum = 0; daynum < data.length; daynum++) {
      let days = data[daynum].day;
      let newDay = document.createElement("p");
      newDay.classList.add("day"); // for visual styling
      newDay.textContent = days;
      daySection.appendChild(newDay);
    }
  })
  .catch(function (error) {
    console.error("Something went wrong with retrieving your JSON file!");
    console.error(error);
  });
