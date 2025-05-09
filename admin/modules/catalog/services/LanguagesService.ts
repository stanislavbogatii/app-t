import { Language } from '@catalogModels/Language';
import apiClientService from '@commonServices/ApiClientService';

const baseUrl = '/langs';

export async function getLanguages(): Promise<Language[]> {
  return (await apiClientService.get(baseUrl)).json();
}

// export async function getCategory(id: number): Promise<Category> {
//   const url = `${baseUrl}/${id}`;
//   return (await apiClientService.get(url)).json();
// }

// export async function createCategory(category: Category) {
//   return await apiClientService.post(baseUrl, JSON.stringify(category));
// }
// export async function updateCategory(id: number, category: Category) {
//   const url = `${baseUrl}/${id}`;
//   const response = await apiClientService.put(url, JSON.stringify(category));
//   if (response.status === 204) return response;
//   else return await response.json();
// }
// export async function deleteCategory(id: number) {
//   const url = `${baseUrl}/${id}`;
//   const response = await apiClientService.delete(url);
//   if (response.status === 204) return response;
//   else return await response.json();
// }

// export async function getProductsByCategory(
//   pageNo: number,
//   categorySlug: string
// ): Promise<ProductThumbnails> {
//   const url = `/api/product/storefront/category/${categorySlug}/products?pageNo=${pageNo}`;
//   return (await apiClientService.get(url)).json();
// }
