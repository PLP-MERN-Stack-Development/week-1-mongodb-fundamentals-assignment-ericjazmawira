/**Find books published after a certain year*/
db.books.find({ published_year: { $gt: 1950 } }).pretty()

/**Find books by a specific author*/
db.books.find({ author: "George Orwell" }).pretty()

/**Update the price of a specific book*/
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 14.99 } }
)

/**Delete a book by its title*/
db.books.deleteOne({ title: "Moby Dick" })


/**----ADVANCED QUERIES---- */
/**Write a query to find books that are both in stock and published after 2010*/
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
)

/**Use projection to return only the title, author, and price fields in your queries*/

/** SYNTAX*/
db.books.find(
  { /* your filter here */ },
  { title: 1, author: 1, price: 1, _id: 0 }
)

/**EXAMPLE OF GEROGE ORWELL */
db.books.find(
  { author: "George Orwell" },
  { title: 1, author: 1, price: 1, _id: 0 }
)

/**Implement sorting to display books by price (both ascending and descending*/
/**Ascending order */ 
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 })

/**Descending order */
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: -1 })

/**Use the `limit` and `skip` methods to implement pagination (5 books per page) */
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 }).skip(0).limit(5)


/**----AGGREGATION PIPELINE---- */
/**Create an aggregation pipeline to calculate the average price of books by genre */
db.books.aggregate([
  {
    $group: {
      _id: "$genre",                // Group by genre
      averagePrice: { $avg: "$price" }  // Calculate average price
    }
  },
  {
    $sort: { averagePrice: -1 }    // sort by average price descending
  }
])

/** Implement a pipeline that groups books by publication decade and counts them */
db.books.aggregate([
  {
    $project: {
      // Calculate the decade, e.g., 1990, 2000, etc.
      decade: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] }
    }
  },
  {
    $group: {
      _id: "$decade",           // Group by decade
      count: { $sum: 1 }        // Count books in each decade
    }
  },
  {
    $sort: { _id: 1 }           // Sort by decade ascending
  }
])


/**INDEXING */
/**Create an index on the `title` field for faster searches */
db.books.createIndex({ title: 1 })

/**Create a compound index on `author` and `published_year` */
db.books.createIndex({ author: 1, published_year: 1 })

/**Use the `explain()` method to demonstrate the performance improvement with your indexes */
db.books.find({ author: "George Orwell" }).explain("executionStats")
