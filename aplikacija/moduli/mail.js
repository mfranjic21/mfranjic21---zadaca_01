const nodemailer = require("nodemailer");

let mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "mfranjic21@student.foi.hr",
        pass: "zemy azmz rcrz onkk",
    },
});

exports.posaljiMail = async function (salje, prima, predmet, poruka) {
    message = {
        from: salje,
        to: prima,
        subject: predmet,
        text: poruka,
    };

    console.log(message);
    let odgovor = await mailer.sendMail(message);
    console.log(odgovor);
    return odgovor;
};
