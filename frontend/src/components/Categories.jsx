import "./Categories.css";

function Categories() {
  return (
    <section className="categories">
      <h2>Popular cities</h2>

      <div className="category-list">
        <div className="category-card">Bangalore</div>
        <div className="category-card">Chennai</div>
        <div className="category-card">Hyderabad</div>
        <div className="category-card">Delhi</div>
        <div className="category-card">Mumbai</div>
      </div>
    </section>
  );
}

export default Categories;
