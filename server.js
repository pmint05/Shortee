const express = require("express");
const {
	Shortee,
	getShortees,
	getShortee,
	saveShortee,
	delShortee,
} = require("./models/Shortee");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
	let shortees = await getShortees();
	res.render("index", { shortees: shortees });
	// res.render("index", { shortees: {} });
});
app.post("/shortee", async (req, res) => {
	let data = await Shortee(req.body.longUrl);
	res.status(200).send(data);
	// res.redirect("/");
});
app.post("/delShortee", async (req, res) => {
	await delShortee(req.body.shortee);
	res.status(200).send({ ok: true });
});
app.get("/:shortee", async (req, res) => {
	if (req.params.shortee != "favicon.ico") {
		const shortee = await getShortee(req.params.shortee);
		if (!shortee) res.sendStatus(404);
		shortee.clicks++;
		await saveShortee(shortee);
		res.redirect(shortee.full);
	}
});
app.listen(process.env.PORT || 5000);
console.log("Server started on port 5000");
