const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// route to get all products
router.get('/', (req, res) => {
  Product.findAll({
    attributes: [
      'id',
      'product_name',
      'price',
      'stock'
    ],
    // foreign key inclusion of Category and Tag
    include: [
      {
        model: Category,
        attributes: [
          'category_name'
        ]
      },
      {
        model: Tag,
        attributes: [
          'tag_name'
        ]
      }
    ]
  })
  // return results to json format
  .then(dbProductData => res.json(dbProductData))
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
});

// route to get one product
router.get('/:id', (req, res) => {
  Product.findOne({
    // signals where to target the product
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'product_name',
      'price',
      'stock'
    ],
    // foreign key inclusion of Category and Tag
    include: [
      {
        model: Category,
        attributes: [
          'category_name'
        ]
      },
      {
        model: Tag,
        attributes: [
          'tag_name'
        ]
      }
    ]
  })
  // error handling, then puts response in json format
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({ message: 'No product found with this id' })
      return;
    }
    res.json(dbProductData)
  })
  // error handling
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// route to create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// route to update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    // signals where to target the product
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

  // route to delete one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    // signals where to target the product
    where: {
      id: req.params.id
    }
  })
  // error handling, then puts response in json format
  .then(dbProductData => {
    if (!dbProductData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.json(dbProductData);
  })
  // error handling
  .catch(err => {
    console.log(err);
    res.json(500).json(err);
  })
});

module.exports = router;
