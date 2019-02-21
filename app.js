$(document).ready(function() {
  validate();
});

function validate() {
  $("#entries, #donator").keyup(function() {
    if ($(this).val() == "") {
      $(".enable").prop("disabled", true);
    } else {
      $(".enable").prop("disabled", false);
    }
  });
}

let raffleArray = [];
let flatArray = [];

const randomize = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const randomizeProgress = () => {
  let currentProgress = 0;
  const interval = setInterval(function() {
    currentProgress += getRandomInt(20, 50);
    $("#dynamic")
      .css("width", currentProgress + "%")
      .attr("aria-valuenow", currentProgress)
      .text(`I'm working on it`)
      .addClass("progress-bar-animated");
    if (currentProgress >= 100) {
      clearInterval(interval);
      $("#dynamic")
        .text(`Entries Randomized`)
        .removeClass("progress-bar-animated");
    }
  }, 1000);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const handleEntry = (name, entries) => {
  const newName = `${name},`;
  const repeatedName = newName.repeat(entries);
  const slicedName = repeatedName.slice(0, -1);
  const fullEntry = slicedName.split(",");
  raffleArray.push(fullEntry);
  $("#donator, #entries").val("");
};

const handleOdds = () => {
  const flatArray = raffleArray.reduce((a, b) => a.concat(b), []);
  const randomizedArray = randomize(flatArray);
  const totalEntries = randomizedArray.reduce(function(obj, item) {
    obj[item] = (obj[item] || 0) + 1;
    return obj;
  }, {});
  let entryValues = Object.values(totalEntries);
  entryValues.forEach(entry => {
    let raffleOdds = ((entry / flatArray.length) * 100).toFixed(2) + "%";
    let spanDiv = $("<span>");
    spanDiv.addClass("percentage m-1 badge badge-light").text(`${raffleOdds}`);
    $("#chance").append(spanDiv);
  });
  return { totalEntries, flatArray };
};

const writeToPage = (totalEntries, flatArray) => {
  let final = JSON.stringify(totalEntries);
  const slicedFinal = final.slice(1, -1);
  const replacedFinal = slicedFinal.replace(/\"/g, " ");
  const trueFinal = replacedFinal.replace(/ :/g, ": ");
  $("#odds").html(
    `<div class="${className("white")}">Entries: ${trueFinal}</div>`
  );

  $("#donation-total").html(
    `<div class="${className("blue")}">Total Entries: ${flatArray.length}</div>`
  );
  $("#pick-winner").prop("disabled", false);
  $(".alert").alert("close");
};

const doSubmit = () => {
  $("#chance").empty();
  const name = $("#donator")
    .val()
    .trim();
  const entries = $("#entries")
    .val()
    .trim();
  if (entries > 0 && entries != "" && name != "") {
    randomizeProgress();
    handleEntry(name, entries);
    const { totalEntries, flatArray } = handleOdds();
    writeToPage(totalEntries, flatArray);
  } else {
    handleErrors();
  }
};

const handleErrors = () => {
  $("#entries, #donator").val("");
  let alertDiv = $("<div>");
  alertDiv
    .addClass("mt-2 alert alert-danger")
    .attr("role", "alert")
    .attr("data-dismiss", "alert")
    .text(`Oops. It's just grease. Click to dismiss.`);
  $(".form-group").append(alertDiv);
};
const className = color => {
  let classes = "badge badge-";
  classes +=
    color == "green"
      ? "success"
      : color == "red"
      ? "danger"
      : color == "white"
      ? "light"
      : color == "yellow"
      ? "warning"
      : color == "blue"
      ? "primary"
      : "dark";
  return classes;
};

const pickWinner = () => {
  const flatArray = raffleArray.reduce((a, b) => a.concat(b), []);
  const random = randomize(flatArray);
  const winner = random[getRandomInt(0, random.length - 1)];
  randomizeProgress();
  let interval = window.setInterval(() => {
    const tickerRandom = random[getRandomInt(0, random.length - 1)];
    $("#shuffle").html(
      `<div class="${className("green")}">${tickerRandom}</div>`
    );
    window.setTimeout(() => {
      clearInterval(interval);
      $("#shuffle").html(`<div class="${className("green")}">${winner}</div>`);
    }, 6000);
  }, 100);

  window.setTimeout(() => {
    $("#winner").html(
      `<div class="${className("white")}">I'm working on it</div>`
    );
  }, 10);
  window.setTimeout(() => {
    $("#winner").html(
      `<div class="${className("white")}">harnessing wizzard logic&trade;</div>`
    );
  }, 1000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">I mean</div>`);
  }, 2000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">To be honest</div>`);
  }, 3000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">Technically</div>`);
  }, 4000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">Literally</div>`);
  }, 5000);
  window.setTimeout(() => {
    $("#winner").html(
      `<div class="${className("dark")}">The winner is...</div>`
    );
  }, 5900);
};

$("#submit").on("click", event => {
  event.preventDefault();
  doSubmit();
});

$("#pick-winner").on("click", event => {
  event.preventDefault();
  if (raffleArray.length == 0) {
    $(".modal").modal();
  } else {
    pickWinner();
  }
});

$("#clear").on("click", event => {
  event.preventDefault();
  raffleArray = [];
  flatArray = [];
  $("#donation-total, #odds, #chance, #winner, #shuffle").empty();
  $(".progress-bar")
    .css("width", "0%")
    .attr("aria-valuenow", 0)
    .text("");
});
