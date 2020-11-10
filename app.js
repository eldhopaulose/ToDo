const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash')
const Schema = mongoose.Schema;
MONGO_UR = 'mongodb+srv://eldhopaulose0485:025eldho_a@cluster0.eghf1.mongodb.net/ToDo?retryWrites=true&w=majority'
mongoose.connect(MONGO_UR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection
    .once('open', () => console.log('connected'))
    .on('error', (error) => {
        console.log("error", error);
    });
const itemsSchema = new mongoose.Schema({
    name: String
})
const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
    name: "Add New Items"
})
const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model('List', listSchema)
const defaultItem = [item1]
const app = express();
app.use(bodyParser.urlencoded({

    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    Item.find({}, (err, foundItem) => {
        if (foundItem.length === 0) {
            Item.insertMany(defaultItem, (err) => {
                if (err) {
                    console.log("err")
                } else {
                    console.log('success')
                }
            });
            res.redirect('/')
        } else {
            res.render("list", { listTitle: day, newListItems: foundItem });
        }
    })
    const day = date.getDate();
});
app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName)
    console.log(customListName)
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                console.log('not exits')
                const list = new List({
                    name: customListName,
                    items: defaultItem
                })
                list.save()
                res.redirect('/' + customListName)
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
            }
        }
    })
})
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    console.log(itemName)
    const item = new Item({
        name: itemName
    })
    if (listName === date.getDate()) {
        item.save();
        res.redirect('/')
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save()
            res.redirect('/' + listName)
        })
    }
});
app.post('/delete', (req, res) => {
    const dleteItemId = req.body.checkbox
    const listName = req.body.listName
    console.log(dleteItemId)
    if (listName === date.getDate()) {
        Item.findByIdAndRemove(dleteItemId, (err) => {
            if (err) {
                console.log('err')
            } else {
                console.log(dleteItemId)
                console.log('susses')
                res.redirect('/')
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: dleteItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName)
            }
        })
    }
})
app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItemse });
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.listen(3000, () => {
    console.log("Server started on port 3000.");
});