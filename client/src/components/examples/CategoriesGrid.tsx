import CategoriesGrid from '../CategoriesGrid';

export default function CategoriesGridExample() {
  return (
    <div className="p-8">
      <CategoriesGrid onSelectCategory={(id, name) => console.log('Selected:', id, name)} />
    </div>
  );
}
