const blogModel = require("./blog-model");
const bookmarkModel = require("../bookmark/bookmark-model");
const { slugGenerator } = require("../../utils/textPraser");
//  CRUD

//create
const create = (payload) => {
  payload.slug = slugGenerator(payload.title);
  return blogModel.create(payload);
};

const getPublishedBlogsOnly = async (search, page = 1, limit = 4) => {
  const query = [];
  if (search?.author) {
    query.push(
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
        $addFields: {
          author: "$author.name",
        },
      },
      {
        $match: {
          author: new RegExp(search?.author, "gi"),
        },
      }
    );
  }

  if (search?.title) {
    query.push({
      $match: {
        title: new RegExp(search?.title, "gi"),
      },
    });
  }

  query.push(
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
    }
  );
  //search,sort and filter
  const result = await blogModel.aggregate(query);
  return {
    data: result[0].data,
    total: result[0].total || 0,
    page: +page,
    limit: +limit,
  };
};

module.exports = { create, getPublishedBlogsOnly };
