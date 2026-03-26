
let appState = {
  members: JSON.parse(localStorage.getItem("members")) || [],
  total: Number(localStorage.getItem("total")) || 0
}

// parte 1

const forms = document.querySelector("form");
const inputPerson = document.querySelector("#person-input");
const addPerson = document.querySelector("#add-person");

// parte 2
const valueInput = document.querySelector("#value-input");
const withPerson = document.querySelector("#with-person");
const nonPerson = document.querySelector("#non-person");

// parte 3
const sectionInfo = document.querySelector(".section-info");
const contMember = document.querySelector("#member-count");
const summaryMembers = document.querySelector("#summary-members");
const summaryTotal = document.querySelector("#summary-total");
const summaryPercent = document.querySelector("#summary-percent");
const summaryStatus = document.querySelector("#summary-status");

forms.addEventListener("submit", (e) => {
  e.preventDefault();
  createPerson();
  elementVerify();
});

const createPerson = (memberData = null) => {
  const personName = memberData ? memberData.name : inputPerson.value;

  const newMember = memberData || {
    id: Date.now(),
    name: inputPerson.value,
    percentage: 0,
  };

  if (!memberData) {
    appState.members.push(newMember);
    saveMembers();

    renderAll();
  }

  contMember.innerText = `Membros (${appState.members.length})`;
  updateSummary();
};

withPerson.addEventListener("click", (e) => {
  if (e.target.closest(".erase")) {
    const btn = e.target.closest(".erase");
    const memberElement = btn.closest(".member");
    const id = Number(memberElement.dataset.id);

    appState.members= appState.members.filter((m) => m.id !== id);
    saveMembers();
    memberElement.remove();
    elementVerify();
    contMember.innerText = `Membros (${appState.members.length})`;
    updateSummary();
  }
});

valueInput.addEventListener("input", () => {
  appState.total = Number(valueInput.value) || 0;  
  saveMembers();
  renderAll();
});

const elementVerify = () => {
  if (withPerson.childElementCount === 0) {
    nonPerson.style.display = "flex";
  } else {
    nonPerson.style.display = "none";
  }
};

const updateSummary = () => {
  const totPercentage = appState.members.reduce((val, ind) => {
    return val + Number(ind.percentage || 0);
  }, 0);

  const totValue = Number(appState.total) || 0;

  summaryMembers.innerText = appState.members.length;
  summaryTotal.innerText = `R$ ${totValue.toFixed(2)}`;
  summaryPercent.innerText = totPercentage.toFixed(2) + " %";
  if (appState.members.length === 0) {
    sectionInfo.style.display = "none";
  } else {
    sectionInfo.style.display = "flex";
    if (totPercentage === 100) {
      summaryStatus.innerText = "distribuição completa";
      summaryStatus.style.color = "#00a63e";
      summaryPercent.style.color = "#00a63e";
      sectionInfo.style.backgroundColor = "#e9ffeb";
      sectionInfo.style.borderColor = "#caffce";
    } else if (totPercentage <= 100) {
      summaryStatus.innerText = "distribuição incompleta";
      summaryStatus.style.color = "#e7000b";
      summaryPercent.style.color = "#e7000b";
      sectionInfo.style.backgroundColor = "#fae0e0";
      sectionInfo.style.borderColor = "#ffc5c5";
    } else {
      summaryStatus.innerText = "distribuição excedente";
      summaryStatus.style.color = "#003aa6";
      summaryPercent.style.color = "#003aa6";
      sectionInfo.style.backgroundColor = "#e9ebff";
      sectionInfo.style.borderColor = "#cadfff";
    }
  }
};

const RestCal = (total, percent) => {
  const totValue = appState.members.reduce((val, ind) => {
    return val + Number(ind.percentage || 0);
  }, 0);
  return Math.max(0, 100 - totValue);
};

const saveMembers = () => {
  localStorage.setItem("members", JSON.stringify(appState.members));
  localStorage.setItem("total", appState.total);
};

const addMembers = (name, percentage) => {
  const member = { id: Date.now(), name, percentage };
  members.push(member);
};

const removeMember = (id) => {
 appState.members= members.filter((m) => m.id !== id);
  saveMembers();
};

const renderAll = () => {
  withPerson.innerHTML = "";

  appState.members.forEach((member) => {
    const { nodeP, perInput, name, value } = renderMember(member);

    const rest = RestCal();

    if (!member.percentage && rest > 0) {
      perInput.value = rest;
      member.percentage = rest;
    }
    if(appState.total > 0){
      const result = CalValue(member.percentage, appState.total);
      value.innerText = `R$ ${result.toFixed(2)}`
    }
    

    name.addEventListener("click", () => {
      const newName = prompt("novo nome: ") || member.name;
      member.name = newName;
      saveMembers();
      renderAll();
    });

    perInput.value = member.percentage;

    perInput.addEventListener("input", () => {
      member.percentage = Number(perInput.value);
      saveMembers();
      updateSummary();
    });
  });

  contMember.innerHTML = `Membros (${appState.members.length})`;
  elementVerify();
  updateSummary();
};

const renderMember = (member) => {
  const name = createEl("p", "set-name", member.name);
  const value = createEl("p", "set-value", "R$ 0.00");

  const section = createEl("section", "container");
  section.append(name, value);

  const perInput = createEl("input", "per-input");
  perInput.type = "number";
  perInput.min = "0";
  perInput.max = "100";

  const perIcon = createEl("span", "per-icon", "percent");
  perIcon.classList.add("material-symbols-outlined");

  const divInput = createEl("div", "div-input");
  divInput.append(perInput, perIcon);

  const delIcon = createEl("span", "del-icon", "delete");
  delIcon.classList.add("material-symbols-outlined");

  const btnDel = createEl("button", "erase");
  btnDel.appendChild(delIcon);

  const nodeP = createEl("section", "member");
  nodeP.append(section, divInput, btnDel);
  withPerson.appendChild(nodeP);
  nodeP.dataset.id = member.id;

  return { nodeP, perInput, name, value };
};

const createEl = (tag, className, text = "") => {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  el.innerText = text;
  return el;
};

const CalValue = (percent, value) => {
  return percent * (value/100);

}


valueInput.value = appState.total;

elementVerify();
renderAll();
