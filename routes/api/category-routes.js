const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// route to find all categories
router.get('/', (req, res) => {
  Category.findAll({
    include: {  
      model: Product,
      attributes: [
        'id',
        'product_name',
        'price',
        'stock',
        'category_id'
      ]}
  })
  // takes information and returns it in JSON
  .then(dbCategoryData => res.json(dbCategoryData))
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});
  // route to find one category by its `id` value
router.get('/:id', (req, res) => {
  Category.findOne({
    // where delete targets the selected category
    where:{
      id: req.params.id
    },
    // includes information from Product model
    include:  {
      model: Product,
      attributes: [
        'id',
        'product_name',
        'price',
        'stock',
        'category_id'
      ]
    }
  })
  // error handling, then returns data in json format
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    // error handling
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

  //route to create a new category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  // route to return data in json format
  .then(dbCategoryData => res.json(dbCategoryData))
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
});

  // route to update a category by its `id` value
router.put('/:id', (req, res) => {
  // where delete targets the selected category
  Category.update(req.body, 
    {
      where: {
        id: req.params.id
      }
    }
  )
  // error handling, then returns data in json formatting
  .then(dbCategoryData => {
    if (!dbCategoryData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(dbCategoryData);
  })
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

  // route to delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    // where delete targets the selected category
    where: {
      id: req.params.id
    }
  })
    // error handling, then returns data in json formatting
  .then(dbCategoryData => {
    if (!dbCategoryData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(dbCategoryData);
  })
    // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
