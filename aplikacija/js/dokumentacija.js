window.addEventListener("load", function () {
    var ERAmodel = document.getElementById("ERA_model");

    ERAmodel.addEventListener("click", function () {
        window.open(ERAmodel.src, "_blank");
    });
});
