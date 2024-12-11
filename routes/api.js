/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book  = require("../models").Book;
module.exports = function (app) {

  app.route('/api/books')
    .get(async (_req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books =  await Book.find({});
        if(!books) {
          res.json([]);
          return;
        }
      
       const formatData = books.map((book) => {
         return {
           _id: book._id,
           title: book.title,
           comments: book.comments,
           cimmentscount: book.comments.length
         };
       });
       res.json(formatData);
       return;
      } catch(err) {
       res.json([]);
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        res.send("missing required field title");
        return;
      }
      
      const newBook = new Book({ title, comments: [] });
      try {
        const book = await newBook.save();
        res.json({ _id: book.id, title: book.title });
      } catch(err) {
        res.json({ error: err});
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const result = await Book.deleteMany();
        console.log("deleted: >> ", result);
        res.send('complete delete successful');
      } catch(err){
        res.send(err);
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      try{
        const book = await Book.findById(bookid);
        res.json({
          comments: book.comments,
          _id: book.id,
          title: book.title,
          commentcount: book.comments.length
        });
      } catch(err) {
        res.send("no book exists");
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) {
        res.send("missing required field comment");
        return;
      }
     
      try{
        const book = await Book.findById(bookid);
        book.comments.push(comment);
        book = await book.save();

        res.json({
          comments: book.comments,
          _id: book.id,
          title: book.title,
          commentcount: book.comments.length
        });

      } catch(err) {
        res.send("no books exsits");
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      try{
        const deleted = await Book.findByIdAndDelete(bookid);
        console.log("Deleted :>> ", deleted);
        if(!deleted) throw new Error("no book exists");
        res.send("delete successful");
      } catch(err) {
        res.send("no book exists");
      }

    });
  
};
