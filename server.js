const express = require("express");
const {
	Shortee,
	getShortees,
	getShortee,
	saveShortee,
	delShortee,
	sendFeedback,
	getLikes,
	setLikes,
} = require("./models/Shortee");
const { getPage } = require("./models/Index");
const cors = require("cors");
const app = express();
app.use(cors());

app.set("view engine", "ejs");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
	let likes = await getLikes();
	res.render("index", { likes: likes });
});
app.post("/shortees", async (req, res) => {
	let uid = req.body.uid;
	let shortees = await getShortees(uid);
	res.status(200).send(shortees);
});
app.post("/shortee", async (req, res) => {
	let data = await Shortee(req.body.longUrl, req.body.uid);
	res.status(200).send(data);
});
app.delete("/delShortee", async (req, res) => {
	await delShortee(req.body.shortee, req.body.uid);
	res.status(200).send({ ok: true });
});
app.post("/page", async (req, res) => {
	let page = req.body.page;
	if (page) res.status(200).send(await getPage(page));
});
app.post("/feedback", async (req, res) => {
	let data = {
		name: req.body.name,
		email: req.body.email,
		message: req.body.message,
		rate: req.body.rate,
		time: req.body.time,
		uid: req.body.uid,
	};
	await sendFeedback(data);
	res.status(200).send({ ok: true });
});
app.post("/likes", async (req, res) => {
	let likes = req.body.likes;
	await setLikes(likes);
	res.status(200).send({ ok: true });
});
app.get("/:shortee", async (req, res) => {
	if (req.params.shortee != "favicon.ico") {
		const shortee = await getShortee(req.params.shortee);
		if (shortee == null) {
			res.redirect("/");
		} else {
			shortee.clicks++;
			await saveShortee(shortee, req.params.shortee);
			res.redirect(shortee.full);
		}
	}
});
app.get("*", function (req, res) {
	res.render("404.ejs");
});
app.listen(process.env.PORT || 5000);
console.log("Server started on port 5000");
