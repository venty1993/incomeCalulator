const resultInvestment = document.querySelector(".result-investment");
const resultRevenue = document.querySelector(".result-revenue");
const resultProfit = document.querySelector(".result-profit");
const utilizationDisplay = document.querySelector(".utiliztion-display");
const totalHoursDisplay = document.querySelector(".total-hour-display");
// 위탁운영 : false, 직접운영 : true
let isDirect = true;

const investment = [
  { key: "deviceSetup", label: "기기 설치비용", value: null, unit: "만원" },
  { key: "interior", label: "인테리어", value: null, unit: "만원" },
  {
    key: "cafe",
    label: "카페설비",
    value: null,
    unit: "만원",
  },
  {
    key: "aircon",
    label: "냉난방",
    value: null,
    unit: "만원",
  },
  {
    key: "facilities",
    label: "집기 및 설비",
    value: null,
    unit: "만원",
  },
  {
    key: "signboard",
    label: "간판",
    value: null,
    unit: "만원",
  },
  { key: "totalInvestment", label: "총 투자금", value: null, unit: "만원" },
];

const investmentElement = [];

const revenue = [
  { key: "perMachineRevenue", label: "대당 매출", value: null, unit: "원" },
  {
    key: "totalMachineRevenue",
    label: "스크린 매출 합",
    value: null,
    unit: "원",
  },
  { key: "dailyVisitors", label: "예상 일 방문객", value: null, unit: "명" },
  { key: "dailyCafeRevenue", label: "음료 매출", value: null, unit: "원" },
  { key: "dailyProductRevenue", label: "용품 매출", value: null, unit: "원" },
  { key: "dailyRevenue", label: "일 매출 합계", value: null, unit: "원" },
];

const revenueElement = [];

const profit = [
  { key: "monthlyMachineRevenue", label: "월 타석 매출", value: null, unit: "원" },
  { key: "monthlyCafeRevenue", label: "월 음료 매출", value: null, unit: "원" },
  { key: "monthlyProductRevenue", label: "월 용품 매출", value: null, unit: "원" },
  { key: "monthlyRevenue", label: "월 매출 합계", value: null, unit: "원" },
  { key: "cafeCost", label: "음료 원가", value: null, unit: "원" },
  { key: "productCost", label: "용품 원가", value: null, unit: "원" },
  { key: "rentAndBills", label: "월세 및 공과금", value: null, unit: "원" },
  { key: "laborCost", label: "인건비", value: null, unit: "원" },
  {
    key: "serviceFee",
    label: "위탁 운영 수수료(66%)",
    value: null,
    unit: "원",
  },
  { key: "monthlyMargin", label: "월 마진", value: null, unit: "원" },
  { key: "annualProfit", label: "연 수익", value: null, unit: "원" },
  { key: "roiAnnual", label: "투자금대비 수익률(년)", value: null, unit: "%" },
];

const profitElement = [];

function getNumberValue(selector) {
  const el = document.querySelector(selector);
  return el ? Number(el.value.replace(/,/g, "")) || 0 : 0;
}

function getInputData() {
  const conversionRateSelect = document.querySelector("#conversion-rate");
  return {
    utilization: getNumberValue("#utilization"),
    gamePrice: getNumberValue(".game-price-input"),
    area: getNumberValue(".area-input"),
    laneCount: getNumberValue(".lane-count-input"),
    rent: getNumberValue(".rent-input"),
    utility: getNumberValue(".utility-input"),
    staffCount: getNumberValue(".staff-count-input"),
    hourlyWage: getNumberValue(".hourly-wage-input"),
    laborRate: getNumberValue(".labor-rate-input"),
    conversionRate: conversionRateSelect ? conversionRateSelect.value : "normal",
    averagePrice: getNumberValue(".average-price-input"),
  };
}

function createResultItem(label, value, unit, key) {
  const item = document.createElement("div");
  item.className = "result-item";
  item.classList.add(key);

  const labelEl = document.createElement("p");
  labelEl.className = "result-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("p");
  valueEl.className = "result-value";
  valueEl.textContent = Number(value).toLocaleString(); // 쉼표 포맷

  const unitEl = document.createElement("p");
  unitEl.className = "result-unit";
  unitEl.textContent = unit;

  item.appendChild(labelEl);
  item.appendChild(valueEl);
  item.appendChild(unitEl);

  return item;
}

function getOperatingTime() {
  const openHour = +document.querySelector("#open-hour").value;
  const openMinute = +document.querySelector("#open-minute").value;
  const closeHour = +document.querySelector("#close-hour").value;
  const closeMinute = +document.querySelector("#close-minute").value;

  const open = openHour + openMinute / 60;
  const close = closeHour + closeMinute / 60;
  const totalHours = close - open;

  return totalHours;
}

const calculate = () => {
  const {
    area,
    gamePrice,
    hourlyWage,
    laneCount,
    rent,
    staffCount,
    utility,
    utilization,
    laborRate,
    conversionRate,
    averagePrice,
  } = getInputData();
  utilizationDisplay.innerText = utilization;
  const totalHours = getOperatingTime();
  totalHoursDisplay.innerText = totalHours;
  // 레저로 기기 대당 2300만원
  const calcInvestment = () => {
    const deviceCost = isDirect ? laneCount * 890*1.1+40 : laneCount * 5500;
    // 카페형 인테리어 평당 150만원
    const cafeCost = isDirect ? 2000 : 0 ;
    const signboardCost = isDirect ? 1500 : 0 ;
    const interiorCost = isDirect ? area * 150 : 0;
    // 카페집기 2000 + 냉난방 평수*20만원 + 좌석 집기 간판 4000만원
    const airconCost = isDirect ? area * 10 : 0 ;
    const facilityCost = isDirect ? (80+90) * laneCount : 0;
    const total = deviceCost + cafeCost + signboardCost + airconCost + interiorCost + facilityCost;

    [deviceCost, interiorCost,cafeCost, airconCost,facilityCost, signboardCost, total].forEach((value, i) => {
      investment[i].value = value;
    });
  };

  const calcRevenue = () => {
    const maxPerMachineRevenue = (totalHours / 0.5) * gamePrice;
    const perMachineRevenue = maxPerMachineRevenue * (utilization / 100);
    const totalMachineRevenue = perMachineRevenue * laneCount;
    const dailyVisitors = totalMachineRevenue / gamePrice / 2;
    const dailyCafeRevenue = dailyVisitors * 5000 * 0.4;
    
    // 구매전환율: 보수적 1%, 일반적 2%, 적극적 4%
    const conversionRateMap = {
      conservative: 1,
      normal: 2,
      aggressive: 4,
    };
    const conversionPercent = conversionRateMap[conversionRate] || 2;
    const dailyProductRevenue = dailyVisitors * (conversionPercent / 100) * averagePrice * 10000;
    const dailyRevenue = totalMachineRevenue + dailyCafeRevenue + dailyProductRevenue;

    [
      perMachineRevenue,
      totalMachineRevenue,
      dailyVisitors,
      dailyCafeRevenue,
      dailyProductRevenue,
      dailyRevenue,
    ].forEach((value, i) => {
      revenue[i].value = value;
    });
  };

  const calcProfit = () => {
    const rentAndBills = isDirect ? (rent + utility) * 10000 : 0;
    const laborCost = isDirect
      ? Math.round(totalHours * (laborRate / 100) * hourlyWage * 7 * 4.34 * staffCount)
      : 0;
    const monthlyMachineRevenue = Math.round(revenue[1].value * 7 * 4.34);
    const monthlyCafeRevenue = Math.round(revenue[3].value * 7 * 4.34);
    const monthlyProductRevenue = Math.round(revenue[4].value * 7 * 4.34);
    const monthlyRevenue = Math.round(revenue[5].value * 7 * 4.34);
    const cafeCost = isDirect ? Math.round(monthlyCafeRevenue * 0.3) : 0;
    const productCost = isDirect ? Math.round(monthlyProductRevenue * 0.6) : 0;
    const serviceFee = isDirect ? 0 : Math.round(monthlyRevenue * 0.66);
    const monthlyMargin =
      monthlyRevenue - serviceFee - laborCost - rentAndBills - cafeCost - productCost;
    const annualProfit = monthlyMargin * 12;
    const roiAnnual = (annualProfit / (investment[investment.length-1].value * 10000)) * 100;

    [
      monthlyMachineRevenue,
      monthlyCafeRevenue,
      monthlyProductRevenue,
      monthlyRevenue,
      cafeCost,
      productCost,
      rentAndBills,
      laborCost,
      serviceFee,
      monthlyMargin,
      annualProfit,
      roiAnnual,
    ].forEach((value, i) => {
      profit[i].value = value;
    });
  };

  calcInvestment();
  calcRevenue();
  calcProfit();
};

const createFields = () => {
  calculate();
  const renterFieldGroud = (array, container, store) => {
    const elements = array.map((item) => {
      const element = createResultItem(
        item.label,
        item.value,
        item.unit,
        item.key
      );
      // 값이 0이면 숨김
      if (item.value === 0 || item.value === null) {
        element.style.display = "none";
      }
      container.appendChild(element);
      return element;
    });

    store.push(...elements);
  };

  renterFieldGroud(investment, resultInvestment, investmentElement);
  renterFieldGroud(revenue, resultRevenue, revenueElement);
  renterFieldGroud(profit, resultProfit, profitElement);
};

createFields();

const refreshFields = () => {
  calculate();
  investmentElement.forEach((item, i) => {
    const value = investment[i].value;
    if (value === 0 || value === null) {
      item.style.display = "none";
    } else {
      item.style.display = "";
      item.querySelector(".result-value").innerText = value.toLocaleString();
    }
  });
  revenueElement.forEach((item, i) => {
    const value = revenue[i].value;
    if (value === 0 || value === null) {
      item.style.display = "none";
    } else {
      item.style.display = "";
      item.querySelector(".result-value").innerText = value.toLocaleString();
    }
  });
  profitElement.forEach((item, i) => {
    const value = profit[i].value;
    if (value === 0 || value === null) {
      item.style.display = "none";
    } else {
      item.style.display = "";
      item.querySelector(".result-value").innerText = value.toLocaleString();
    }
  });
};

const inputs = document.getElementsByTagName("input");
const selects = document.getElementsByTagName("select");

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("change", refreshFields);
}

for (let i = 0; i < selects.length; i++) {
  selects[i].addEventListener("change", refreshFields);
}

const [franchiseButton, directButton] =
  document.getElementsByClassName("type-option");

franchiseButton.addEventListener("click", () => {
  isDirect = false;
  refreshFields();
  franchiseButton.classList.add("is-selected");
  directButton.classList.remove("is-selected");
});

directButton.addEventListener("click", () => {
  isDirect = true;
  refreshFields();
  franchiseButton.classList.remove("is-selected");
  directButton.classList.add("is-selected");
});
