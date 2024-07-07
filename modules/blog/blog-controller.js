const blogModel = require("./blog-model");
const bookmarkModel = require("../bookmark/bookmark-model");
//  CRUD

//create
const create = (payload) => {
  return blogModel.create(payload);
};

//Search
const getAll = async (page = 1, limit = 20) => {
  const query = [];
 
  //default query
  // query.push(
  //   {

  //     $facet: {
  //       metaData: [
  //         {
  //           $count: "total",
  //         },
  //       ],
  //       data: [
  //         {
  //           $skip: (+page - 1) * +limit,
  //         },
  //         { $limit: +limit },
  //       ],
  //     },
  //   },
  //   {
  //     $addFields: {
  //       total: {
  //         $arrayElemAt: ["$metaData.total", 0],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       metaData: 0,
  //     },
  //   }
  // );

  query.push([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        title: 1,
        author: "$author.name",
        createdAt: 1,
      },
    },
    {
      $facet: {
        metaData: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          { $limit: +limit },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metaData.total", 0],
        },
      },
    },
    {
      $project: {
        metaData: 0,
      },
    },
  ]);
  //search,sort and filter
  const result = await blogModel.aggregate(query);
  return {
    data: result[0].data,
    total: result[0].total || 0,
    page: +page,
    limit: +limit,
  };
};

const getById = (_id) => {
  return blogModel.findOne({ _id });
};

//update
const updateById = (_id, payload) => {
  return blogModel.updateOne({ _id }, payload);
};

//delete
const deleteById = (_id) => {
  return blogModel.deleteOne({ _id });
};

const bookMark = (payload) => {
  const { blogs, user } = payload;
  if (!blogs.length > 0 || !user) throw new Error("Blogs and user missing");
  bookmarkModel.create(payload);
};

const authorBlog = (search) => {
  return blogModel.aggregate();
};
module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  bookMark,
  authorBlog,
};
