function Post(details) {
  return (
    <div
      className="shadow-lg w-36 h-44 bg-slate-100"
      onClick={() =>
        (window.location.href = `/group/${details.groupID}/post/${details.id}`)
      }
    >
      <h1>{details.title}</h1>
      <h4>{details.author}</h4>
      <p>{details.description}</p>
      {details.img ? <img src={details.img} /> : null}
      {details.vid ? <img src={details.vid} /> : null}
    </div>
  );
}

export default Post;
