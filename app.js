$(function() {
  $("#entries, #name").keyup(function() {
    if ($(this).val() == "") {
      $(".enable").prop("disabled", true);
    } else {
      $(".enable").prop("disabled", false);
    }
  });
});

const raffleArray = [];
const flatArray = [];

const randomize = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const randomizeTimer = () => {
  let current_progress = 0;
  const interval = setInterval(function() {
    current_progress += getRandomInt(20, 50);
    $("#dynamic")
      .css("width", current_progress + "%")
      .attr("aria-valuenow", current_progress)
      .text(`Randomizing Entries`)
      .addClass("progress-bar-animated");
    if (current_progress >= 100) {
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

const doSubmit = () => {
  const name = $("#donator")
    .val()
    .trim();
  const entries = $("#entries")
    .val()
    .trim();
  const newName = `${name} `;
  const repeatedName = newName.repeat(entries);
  const trimmedName = repeatedName.trim();
  const fullEntry = trimmedName.split(" ");
  raffleArray.push(fullEntry);
  $("#donator").val("");
  $("#entries").val("");
  const flatArray = raffleArray.flat(1);
  const randomizedArray = randomize(flatArray);
  const totalEntries = randomizedArray.reduce(function(obj, item) {
    obj[item] = (obj[item] || 0) + 1;
    return obj;
  }, {});
  //const arr = [];
  // arr.push(totalEntries);
  //console.log(arr);
  //arr.forEach(donator => {
  //  console.log(donator);
  //  const odds1 = donator / raffleArray.length;
  //  console.log(odds1);
  // });
  $("#odds").text(`Entries: ${JSON.stringify(totalEntries)}`);
  $("#donation-total").text(`Total Entries: ${flatArray.length}`);
  randomizeTimer();
  $("#pick-winner").prop("disabled", false);
};

const pickWinner = () => {
  const flatArray = raffleArray.flat(1);
  const random = randomize(flatArray);
  const winner = random[Math.floor(Math.random() * random.length)];
  $("#winner").text(`THE WINNER IS... ${winner}`);
};

$("#submit").on("click", event => {
  event.preventDefault();
  doSubmit();
});

$("#pick-winner").on("click", event => {
  event.preventDefault();
  pickWinner();
});
