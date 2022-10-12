const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint
// route to find all tags
router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    // foreign key for product to include information
    include: {
      model: Product,
      attributes: [
        'product_name',
        'price',
        'stock',
        'category_id'
      ]
    },
  })
  // puts response into json format
  .then(dbTagData => res.json(dbTagData))
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});

// route to find a single tag by its id
router.get('/:id', (req, res) => {
  Tag.findOne({
    // targets a tag's id
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'tag_name'
    ],
    // foreign key for product to include information
    include: [
      {
        model: Product,
        attributes: [
          'product_name',
          'price',
          'stock',
          'category_id'
        ]
      }
    ]
  })
    // error handling, then puts response in json format
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.json(dbTagData);
  })
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
  // be sure to include its associated Product data
});

// route to create a new tag
router.post('/', (req, res) => {
// creates a tag by name
  Tag.create({
    tag_name: req.body.tag_name
  })
  // puts response into json format
  .then(dbTagData => res.json(dbTagData))
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// route to update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  // targets a tag's id
  Tag.update(req.body,
    {
      where: {
        id: req.params.id
      }
    }
  )
    // error handling, then puts response in json format
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id' })
      return;
    }
    res.json(dbTagData);
  })
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

  // route to delete on tag by its `id` value
router.delete('/:id', (req, res) => {
  // targets a tag's id
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    // error handling, then puts response in json format
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with that id' })
      return;
    }
    res.json(dbTagData);
  })
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
