const mainComment = document.getElementById("myInput");
const commentList = document.getElementById("commentList");

//add a new comment
let addComment = () => {
	if (!localStorage.getItem("comments")) {
		let comments = [];
		localStorage.setItem("comments", JSON.stringify(comments));
	}

	comments = JSON.parse(localStorage.getItem("comments"));
	comments.push({
		parentCommentId: null,
		commentId: Math.random()
			.toString()
			.substr(2, 7),
		commentText: mainComment.value,
		childComments: []
	});
	localStorage.setItem("comments", JSON.stringify(comments));
	finalComments();
	mainComment.value = "";
};
let deleteComments = () => {
	localStorage.clear();
	location.reload(); 
};

let deleteComment = (allComments, newCommentId) => {
	for (let i in allComments) {
		if (allComments[i].commentId === newCommentId) {
			allComments.splice(i, 1);
		} else if (allComments[i].childComments.length > 0) {
			deleteComment(allComments[i].childComments, newCommentId);
		}
	}
};
// create a reply option
let createReplyButtonCommentView = (id, operationType) => {
	let div = document.createElement("div");
	div.setAttribute("data-parentId", id);
	div.innerHTML = `<input type="text"> <a href="#" class="btn btn-primary">${operationType}</a>`;

	return div;
};
// genarate a single comment card
let singleCommentCard = (obj, padding) => `
    <div class="card border-dark mt-2 mb-3 col-md-5"style="margin-left: ${padding}px;" data-parentId="${
	obj.parentCommentId
	}" id="${obj.commentId}">
	<div class="card-header text-white bg-dark mt-2 mb-2 ">${obj.commentText}</div>
        <a href="#" class="btn btn-danger col-2">Reply</a><span style="color: green;"> ${
					obj.childComments.length === 0 ? "0 replies to this comment" : obj.childComments.length + " replies to this answer"
				}</span>
        <a href="#" class="btn btn-danger col-2">Likes</a><span style="color: green;"> ${
					obj.Likes === 0 ? "" : obj.Likes
				}</span>
        <a href="#"> Edit</a>
        <a href="#"> Delete </a>
    </div>
    `;
// a recursive method to generate a collection of comments if there are nested comment childrens
let createRecusiveComments = (commentList, padding = 0) => {
	let fullView = "";
	for (let i of commentList) {
		console.log(i);
		fullView += singleCommentCard(i, padding);
		if (i.childComments.length > 0) {
			fullView += createRecusiveComments(i.childComments, (padding += 20));
			padding -= 20;
		}
	}
	return fullView;
};

// generate all the comments
let finalComments = () => {
	let getCommentsFromLocalStorage = JSON.parse(
		localStorage.getItem("comments")
	);
	if (getCommentsFromLocalStorage) {
		let allComments = createRecusiveComments(getCommentsFromLocalStorage);
		commentList.innerHTML = allComments;
	}
};

finalComments();

// recursive method to push the new child comment
let addNewChildComment = (allComments, newComment) => {
	for (let i of allComments) {
		if (i.commentId === newComment.parentCommentId) {
			i.childComments.push(newComment);
		} else if (i.childComments.length > 0) {
			addNewChildComment(i.childComments, newComment);
		}
	}
};

// get all comments from local storage
let getComments = () => JSON.parse(localStorage.getItem("comments"));

// set comments object again in local storage
let setComments = allComments =>
	localStorage.setItem("comments", JSON.stringify(allComments));

    // get all comments from local storage
let getAllComments = () => JSON.parse(localStorage.getItem("comments"));

// set comments object again in local storage
let setAllComments = allComments =>
	localStorage.setItem("comments", JSON.stringify(allComments));

// recursive method to update the comment
let updateComment = (allComments, updatedCommentId, updatedCommentText) => {
	for (let i of allComments) {
		if (i.commentId === updatedCommentId) {
			i.commentText = updatedCommentText;
		} else if (i.childComments.length > 0) {
			updateComment(i.childComments, updatedCommentId, updatedCommentText);
		}
	}
};
// Event delegation for "comment", "edit comment", "like", "update comment" click and "add new child" comment in existing comments
commentList.addEventListener("click", e => {
	if (e.target.innerText === "Reply") {
		const parentId = !e.target.parentNode.getAttribute("data-parentId")
			? e.target.parentNode.getAttribute("data-parentId")
			: e.target.parentNode.getAttribute("id");
		const currentParentComment = e.target.parentNode;
		currentParentComment.appendChild(
			createReplyButtonCommentView(parentId, "Add Comment")
		);
		e.target.style.display = "none";
		e.target.nextSibling.style.display = "none";
	} else if (e.target.innerText === "Add Comment") {
		const parentId = e.target.parentNode.getAttribute("data-parentId")
			? e.target.parentNode.getAttribute("data-parentId")
			: e.target.parentNode.getAttribute("id");
		const newAddedComment = {
			parentCommentId: parentId,
			commentId: Math.random()
				.toString()
				.substr(2, 7),
			commentText: e.target.parentNode.firstChild.value,
			childComments: [],
			Likes: 0
		};
		let getCommentsFromLocalStorage = getAllComments();
		addNewChildComment(getCommentsFromLocalStorage, newAddedComment);
		setAllComments(getCommentsFromLocalStorage);
		finalComments();
	} else if (e.target.innerText === "Likes") {
		let getCommentsFromLocalStorage = getAllComments();
		increaseLikeByOne(getCommentsFromLocalStorage, e.target.parentNode.id);
		setAllComments(getCommentsFromLocalStorage);
		finalComments();
	} else if (e.target.innerText === "Edit") {
		const parentId = !e.target.parentNode.getAttribute("data-parentId")
			? e.target.parentNode.getAttribute("data-parentId")
			: e.target.parentNode.getAttribute("id");
		const currentParentComment = e.target.parentNode;

		const complateCommentText = e.target.parentNode.innerText;
		const commentToArray = complateCommentText.split(" ");
		const findIndexOfLikes = commentToArray.indexOf("Likes");
		const realComment = commentToArray.slice(0, findIndexOfLikes);

		currentParentComment.appendChild(
			createReplyButtonCommentView(
				parentId,
				"update Comment",
				realComment.join(" ")
			)
		);
		e.target.style.display = "none";
	} else if (e.target.innerText === "update Comment") {
		const parentId = e.target.parentNode.getAttribute("data-parentId")
			? e.target.parentNode.getAttribute("data-parentId")
			: e.target.parentNode.getAttribute("id");

		let getCommentsFromLocalStorage = getAllComments();
		updateComment(
			getCommentsFromLocalStorage,
			parentId,
			e.target.parentNode.firstChild.value
		);
		setAllComments(getCommentsFromLocalStorage);
		finalComments();
	} else if (e.target.innerText === "Delete") {
		const parentId = e.target.parentNode.getAttribute("id");
		let getCommentsFromLocalStorage = getAllComments();
		deleteComment(getCommentsFromLocalStorage, parentId);
		setAllComments(getCommentsFromLocalStorage);
		finalComments();
	}
});