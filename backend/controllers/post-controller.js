const Post = require('../model-schemas/post');
const { query } = require('express');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        photoPath: url + '/images/photos/' + req.file.filename,
        creator: req.userData.userId
    });
    console.log(post);
    post.save().then( createdPost => {
        res.status(201).json(
            {
                message: 'Post added succesfully.',
                data: { ...createdPost, id: createdPost._id }
            }
        );
    })
    .catch(err => {
        console.log('Err/exception in Adding / Creating new Post :', err)
        res.status(400).json({
            message: "Post not added/created, exception occured.",
            data: exception
        });
    });   
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.postsPerPage;
    const pageIndex = +req.query.pageIndex;
    let fetchedPosts;
    let queryPost = pageIndex && pageSize
        ? Post.find().sort({date:-1}).skip(pageSize * (pageIndex - 1)).limit(pageSize)
        : Post.find().sort({date:-1});
    if (req && req.query && req.query.id) {
        Post.findById(req.query.id).then( (post) => {
            if (post) {
                res.status(200).json({
                    message: `Post with id: ${post._id}  has been found.`,
                    data: post
                });
            } else {
                res.status(404).json({
                    message: `Sorry! Post with id: ${rez.query.id}, Not found!`
                });
            }
        })
        .catch(err => {
            if (err) {
                console.log('Err/exception in get-post-By-ID api :', err);
                res.status(400).json({
                    message: `Exception in finding Post by ID, queried ID=[${req.query.id}].`,
                    data: err
                });
            }
        });
    } else {
        queryPost.then(documents => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Sucessesfully fetched posts.",
                data: { posts: fetchedPosts, totalPosts: count }
            });
        })
        .catch(err => {
            if (err) {
                console.log('Err/exception in get-post-By-ID api :', err);
                res.status(400).json({
                    message: `Exception in finding Post by ID, queried ID=[${req.query.id}].`,
                    data: err
                });
            }
        });
    }
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then( result => {
        console.log(result);
        res.status(result.deletedCount === 1 ? 200 : 401).json({ 
            message: result.deletedCount === 1 ? 'Post has been Deleted! sucessfully.' : 'Unauthorised!',
            data: result
        });
    }).catch( exception => {
        console.log('Exception at delete one post by ID api :', exception);
        res.status(400).json({
            message: "Post not deleted, An exception occured !",
            data: exception
        });
    });
}

exports.updatePost = (req, res, next) => {
    let photoPath = req.body.photoPath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        photoPath = url + '/images/photos/' + req.file.filename
    }
    const post = new Post({
        _id: req.query.id,
        title: req.body.title,
        content: req.body.content,
        photoPath: photoPath
    });
    Post.updateOne({_id: req.query.id, creator: req.userData.userId}, post).then(result => {
        console.log(result);
        res.status(result.n > 0 ? 200 : 401).json({ 
            message: result.n > 0 ? (result.nModified === 1 ? 'Post has been Patched! sucessfully.' : 'No changes made to the post.') : 'Unauthorised!',
            data: result
        });
    })
    .catch(err => {
        console.log('Err/exception in updating post put-api :', err);
        res.status(400).json({
            message: "Post not updated exception occured.",
            data: exception
        });
    });
}
