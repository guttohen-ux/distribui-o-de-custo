let contNumMember = 0;

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

const createPerson = () => {
  contNumMember++;

  const name = document.createElement("p");
  name.classList.add("set-name");
  name.innerText = inputPerson.value;

  const value = document.createElement("p");
  value.classList.add("set-value");
  value.innerText = "R$ 0.00";

  const section = document.createElement("section");
  section.classList.add("container");
  section.appendChild(name);
  section.appendChild(value);

  const perInput = document.createElement("input");
  perInput.classList.add("per-input");
  perInput.name = "percentage";
  perInput.type = "number";
  perInput.step = "any";
  perInput.placeholder = "0";
  perInput.min = "0";
  perInput.max = "100";

  const rest = RestCal();

  if (rest > 0) {
    perInput.value = rest;
    if (valueInput.value > 0)
      valueInput.innerText = `R$ ${rest * (valueInput.value / 100).toFixed(2)}`;
  }

  const perIcon = document.createElement("span");
  perIcon.classList.add("per-icon");
  perIcon.classList.add("material-symbols-outlined");
  perIcon.innerText = "percent";

  const divInput = document.createElement("div");
  divInput.classList.add("div-input");
  divInput.appendChild(perInput);
  divInput.appendChild(perIcon);

  const delIcon = document.createElement("span");
  delIcon.classList.add("del-icon");
  delIcon.classList.add("material-symbols-outlined");
  delIcon.innerText = "delete";

  const btnDel = document.createElement("button");
  btnDel.classList.add("erase");
  btnDel.appendChild(delIcon);

  const nodeP = document.createElement("section");
  nodeP.classList.add("member");
  nodeP.appendChild(section);
  nodeP.appendChild(divInput);
  nodeP.appendChild(btnDel);
  inputPerson.value = "";
  withPerson.appendChild(nodeP);

  name.addEventListener("click", () => {
    const newName = prompt("novo nome: ");
    name.innerText = newName;
  });

  perInput.addEventListener("input", () => {
    if (valueInput.value > 0) {
      const result = Number(perInput.value) * (valueInput.value / 100);
      value.innerText = `R$ ${result.toFixed(2)} `;
    } else {
      value.innerText = "-";
    }
    updateSummary();
  });
  contMember.innerText = `Membros (${contNumMember})`;
  updateSummary();
};

withPerson.addEventListener("click", (e) => {
  if (e.target.closest(".erase")) {
    const btn = e.target.closest(".erase");
    const member = btn.closest(".member");
    contNumMember--;
    member.remove();
    elementVerify();
    contMember.innerText = `Membros (${contNumMember})`;
    updateSummary();
  }
});

valueInput.addEventListener("input", () => {
  const queryperInput = document.querySelectorAll(".per-input");
  queryperInput.forEach((inp) => {
    const member = inp.closest(".member");
    const value = member.querySelector(".set-value");
    if (valueInput.value > 0) {
      const result = Number(inp.value) * (valueInput.value / 100);
      value.innerText = `R$ ${result.toFixed(2)} `;
    } else {
      value.innerText = "-";
    }
    updateSummary();
  });
});

const elementVerify = () => {
  if (withPerson.childElementCount === 0) {
    nonPerson.style.display = "flex";
  } else {
    nonPerson.style.display = "none";
  }
};

const updateSummary = () => {
  const allPerInput = document.querySelectorAll(".per-input");

  const totPercentage = [...allPerInput].reduce((val, ind) => {
    return val + Number(ind.value);
  }, 0);

  const totValue = Number(valueInput.value) || 0;

  summaryMembers.innerText = contNumMember;
  summaryTotal.innerText = `R$ ${totValue.toFixed(2)}`;
  summaryPercent.innerText = totPercentage.toFixed(2) + " %";
  if (contNumMember === 0) {
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

const RestCal = () => {
  const allPerInput = document.querySelectorAll(".per-input");
  const totValue = [...allPerInput].reduce((val, ind) => {
    return val + Number(ind.value);
  }, 0);
  return Math.max(0, 100 - totValue);
};
