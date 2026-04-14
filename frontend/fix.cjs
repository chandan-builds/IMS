const fs = require('fs');
const path = require('path');

const files = [
  'src/features/categories/components/CategoryManager.tsx',
  'src/features/categories/hooks/useCategoryViewModel.ts',
  'src/features/categories/services/categoryApi.ts',
  'src/features/products/components/ProductForm.tsx',
  'src/features/products/components/ProductList.tsx',
  'src/features/products/hooks/useProductFilters.ts',
  'src/features/products/hooks/useProductViewModel.ts',
  'src/features/products/services/productApi.ts',
  'src/features/units/components/UnitManager.tsx',
  'src/features/units/hooks/useUnitViewModel.ts',
  'src/features/units/services/unitApi.ts'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix TS1484 type imports
  content = content.replace(/import \{ (Category, CreateCategoryDto, UpdateCategoryDto) \}/g, 'import type { $1 }');
  content = content.replace(/import \{ (CreateCategoryDto, UpdateCategoryDto) \}/g, 'import type { $1 }');
  content = content.replace(/import \{ (Product, CreateProductDto) \}/g, 'import type { $1 }');
  content = content.replace(/import \{ (Product) \} from/g, 'import type { $1 } from');
  content = content.replace(/import \{ (CreateProductDto, UpdateProductDto, ProductQueryParams) \}/g, 'import type { $1 }');
  content = content.replace(/import \{ (ProductQueryParams) \} from/g, 'import type { $1 } from');
  content = content.replace(/import \{ \n  (Product, \n  CreateProductDto, \n  UpdateProductDto, \n  ProductQueryParams, \n  PaginatedProductResponse) \n\}/g, 'import type {\n  $1\n}');
  content = content.replace(/import \{\s*Product,\s*CreateProductDto,\s*UpdateProductDto,\s*ProductQueryParams,\s*PaginatedProductResponse\s*\}/, 'import type { Product, CreateProductDto, UpdateProductDto, ProductQueryParams, PaginatedProductResponse }');
  content = content.replace(/import \{ (Unit, CreateUnitDto, UpdateUnitDto) \}/g, 'import type { $1 }');
  content = content.replace(/import \{ (CreateUnitDto, UpdateUnitDto) \}/g, 'import type { $1 }');
  
  content = content.replace(/import \{ (Table, Column) \}/g, "import { Table } from '../../../components/ui/Table';\nimport type { Column }");
  content = content.replace(/import \{ (Select, SelectOption) \}/g, "import { Select } from '../../../components/ui/Select';\nimport type { SelectOption }");

  // 2. Fix Badge variants
  content = content.replace(/variant="neutral"/g, 'variant="default"');
  content = content.replace(/variant='secondary'/g, "variant='default'");
  content = content.replace(/variant={row.status === 'active' \? 'success' : row.status === 'inactive' \? 'secondary' : 'danger'}/g, "variant={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'default' : 'danger'}");

  // 3. Fix Button variants
  content = content.replace(/variant="primary"/g, 'variant="default"');

  // 4. Fix ConfirmDialog
  content = content.replace(/onClose=\{\(\) => setCategoryToDelete\(null\)\}/g, 'onCancel={() => setCategoryToDelete(null)}');
  content = content.replace(/onClose=\{\(\) => setUnitToDelete\(null\)\}/g, 'onCancel={() => setUnitToDelete(null)}');

  // 5. Fix exportExcel
  content = content.replace(/onClick=\{\(\) => exportExcel\(\)\}/g, 'onClick={() => exportExcel(undefined)}');

  fs.writeFileSync(filePath, content, 'utf8');
}
