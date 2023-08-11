import './Products.css';
import { multiFiles } from '../api/api';
import { useGetSubCategoriesQuery } from '../api/subcategory';
import Breadcrumb from '../components/Breadcrumb';
import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleChangeModal } from '../reducers/modals';
import { useGetCategoryQuery } from '../api/category';
import { useGetBrandsQuery } from '../api/brands';
import FormBuilder from '../components/FormBuilder';
import {
  useAddProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  usePutProductMutation,
} from '../api/product';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from '@material-tailwind/react';
type Inputs = {
  id: number;
  name: string;
  categoryId: number;
  subCategoryId: number;
  brandId: number;
  price: number;
  discount?: number;
  hasDiscount: boolean;
  isNew: boolean;
  properties: any[];
  media: any[];
};
const Products = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState<any>();
  const [categoryId, setCategoryId] = useState<any>();
  const [subCategoryId, setSubCategoryId] = useState<any>();
  const [brandId, setBrandId] = useState<any>();
  const [price, setPrice] = useState<any>();
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [discount, setDiscount] = useState<any>();
  const [isNew, setIsNew] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [file, setFile] = useState([]);
  const [editFile, setEditFile] = useState<any[]>([]);
  const [idx, setIdx] = useState<number>(0);
  const { data = [] } = useGetProductsQuery(search);
  const [addProduct] = useAddProductMutation();
  const [editProduct] = usePutProductMutation();
  const [delProduct] = useDeleteProductMutation();
  const deleteModal = useSelector(({ modals }) => modals.modal.deleteModal);
  const editModal = useSelector(({ modals }) => modals.modal.editModal);
  const addModal = useSelector(({ modals }) => modals.modal.addModal);
  const { data: categories = [] } = useGetCategoryQuery('');
  const { data: subcategories = [] } = useGetSubCategoriesQuery('');
  const { data: brands = [] } = useGetBrandsQuery('');
  const [properties, setProperties] = useState<any[]>([]);

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setSubCategoryId('');
    setBrandId('');
    setPrice('');
    setDiscount('');
    setHasDiscount(false);
    setIsNew(false);
    setFile([]);
    setProperties([]);
  };
  const onSubmit = async () => {
    if (file.length == 0) return alert('Please select a file');
    const formData = new FormData();
    for (const a of file) {
      formData.append('files', a);
    }
    const image = await multiFiles(formData);
    const arr = [];

    for (let img of image.img) {
      let obj = {
        type: img.mimetype,
        src: img.path,
      };
      arr.push(obj);
    }
    addProduct({
      name,
      categoryId: Number(categoryId),
      subCategoryId: Number(subCategoryId),
      brandId: Number(brandId),
      price: Number(price),
      discount: Number(discount),
      hasDiscount,
      isNew,
      properties: properties,
      media: arr,
    });
    resetForm();
    dispatch(handleChangeModal({ name: 'addModal', value: false }));
  };
  const UpdateModal = (product: Inputs) => {
    setName(product.name);
    setCategoryId(product.categoryId);
    setSubCategoryId(product.subCategoryId);
    setBrandId(product.brandId);
    setPrice(product.price);
    setDiscount(product.discount);
    setHasDiscount(product.hasDiscount);
    setIsNew(product.isNew);
    setEditFile(product.media);
    setProperties(product.properties);
    dispatch(handleChangeModal({ name: 'editModal', value: true }));
    setIdx(product.id);
  };
  const onSubmitUpdate = async () => {
    const obj = {
      id: idx,
      name,
      categoryId: Number(categoryId),
      subCategoryId: Number(subCategoryId),
      brandId: Number(brandId),
      price: Number(price),
      discount: Number(discount),
      hasDiscount,
      isNew,
      properties: properties,
    };
    if (file.length == 0) {
      editProduct({ ...obj, media: editFile });
    } else {
      const formData = new FormData();
      for (const a of file) {
        formData.append('files', a);
      }
      const image = await multiFiles(formData);
      const arr = [];

      for (let img of image.img) {
        let obj = {
          type: img.mimetype,
          src: img.path,
        };
        arr.push(obj);
      }
      editProduct({ ...obj, media: arr });
    }
    resetForm();
    dispatch(handleChangeModal({ name: 'editModal', value: false }));
  };
  return (
    <>
      <Breadcrumb pageName="Products" />
      <div>
        <div className="flex flex-col sm:p-6.5 py-2">
          <div className="flex flex-col items-center">
            <div className="flex justify-end w-full">
              <button
                onClick={() =>
                  dispatch(handleChangeModal({ name: 'addModal', value: true }))
                }
                className="sm:inline-flex flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                <span>
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.0758 0.849976H16.0695C15.819 0.851233 15.5774 0.942521 15.3886 1.10717C15.1999 1.27183 15.0766 1.49887 15.0414 1.74685L14.4789 5.80935H13.3976V3.4031C13.3952 3.1654 13.3002 2.93802 13.1327 2.76935C12.9652 2.60068 12.7384 2.50403 12.5008 2.49998H10.082C10.0553 2.27763 9.94981 2.07221 9.78472 1.92089C9.61964 1.76956 9.40584 1.68233 9.18202 1.67498H6.45389C6.32885 1.67815 6.20571 1.70632 6.09172 1.75782C5.97773 1.80932 5.8752 1.8831 5.79017 1.97484C5.70513 2.06657 5.63932 2.17439 5.59659 2.29195C5.55387 2.40951 5.5351 2.53443 5.54139 2.65935V3.32498H3.15077C2.91396 3.32162 2.68544 3.41207 2.51507 3.57659C2.3447 3.7411 2.24632 3.96632 2.24139 4.2031V5.81248C2.0999 5.81539 1.96078 5.84937 1.83387 5.91201C1.70697 5.97466 1.59538 6.06443 1.50702 6.17498C1.41616 6.29094 1.35267 6.42593 1.32128 6.56986C1.2899 6.7138 1.29143 6.86297 1.32577 7.00623C1.32443 7.02182 1.32443 7.0375 1.32577 7.0531L3.23827 12.9375C3.29323 13.1432 3.4153 13.3247 3.58513 13.4532C3.75496 13.5818 3.96282 13.6499 4.17577 13.6468H13.3883C13.7379 13.6464 14.0756 13.5197 14.3391 13.29C14.6027 13.0603 14.7744 12.7431 14.8226 12.3968L16.2508 2.09998H18.0726C18.2384 2.09998 18.3974 2.03413 18.5146 1.91692C18.6318 1.79971 18.6976 1.64074 18.6976 1.47498C18.6976 1.30922 18.6318 1.15024 18.5146 1.03303C18.3974 0.915824 18.2384 0.849976 18.0726 0.849976H18.0758ZM12.1383 5.79373H10.0945V3.74998H12.1476L12.1383 5.79373ZM6.79139 2.9156H8.84452V3.39998V5.7906H6.79139V2.9156ZM3.49139 4.5656H5.54139V5.79373H3.49139V4.5656ZM13.5851 12.225C13.579 12.2727 13.5556 12.3166 13.5193 12.3483C13.4831 12.38 13.4364 12.3972 13.3883 12.3968H4.37577L2.65389 7.04998H14.3039L13.5851 12.225Z"
                      fill=""
                    />
                    <path
                      d="M5.31172 15.1125C4.9118 15.1094 4.51997 15.2252 4.18594 15.4451C3.85191 15.665 3.59073 15.9792 3.43553 16.3478C3.28034 16.7164 3.23813 17.1228 3.31425 17.5154C3.39037 17.908 3.58139 18.2692 3.86309 18.5531C4.14478 18.837 4.50445 19.0308 4.89647 19.11C5.28849 19.1891 5.6952 19.1501 6.06499 18.9978C6.43477 18.8454 6.75099 18.5867 6.97351 18.2544C7.19603 17.9221 7.31483 17.5312 7.31485 17.1312C7.31608 16.8671 7.26522 16.6053 7.16518 16.3608C7.06515 16.1164 6.91789 15.894 6.73184 15.7065C6.5458 15.519 6.3246 15.3701 6.08092 15.2681C5.83725 15.1662 5.57586 15.1133 5.31172 15.1125ZM5.31172 17.9C5.15905 17.9031 5.00891 17.8607 4.88045 17.7781C4.75199 17.6955 4.65103 17.5766 4.59045 17.4364C4.52986 17.2962 4.51239 17.1412 4.54026 16.9911C4.56814 16.8409 4.64009 16.7025 4.74695 16.5934C4.85382 16.4843 4.99075 16.4096 5.14028 16.3786C5.28981 16.3477 5.44518 16.3619 5.58656 16.4196C5.72794 16.4773 5.84894 16.5758 5.93412 16.7026C6.0193 16.8293 6.06481 16.9785 6.06484 17.1312C6.06651 17.3329 5.9882 17.5271 5.84705 17.6712C5.70589 17.8152 5.51341 17.8975 5.31172 17.9Z"
                      fill=""
                    />
                    <path
                      d="M12.9504 15.1125C12.5505 15.1094 12.1586 15.2252 11.8246 15.4451C11.4906 15.665 11.2294 15.9792 11.0742 16.3478C10.919 16.7164 10.8768 17.1228 10.9529 17.5154C11.029 17.908 11.2201 18.2692 11.5018 18.5531C11.7835 18.837 12.1431 19.0308 12.5351 19.11C12.9272 19.1891 13.3339 19.1501 13.7037 18.9978C14.0734 18.8454 14.3897 18.5867 14.6122 18.2544C14.8347 17.9221 14.9535 17.5312 14.9535 17.1312C14.9552 16.598 14.7452 16.086 14.3696 15.7075C13.994 15.329 13.4836 15.115 12.9504 15.1125ZM12.9504 17.9C12.7977 17.9031 12.6476 17.8607 12.5191 17.7781C12.3907 17.6955 12.2897 17.5766 12.2291 17.4364C12.1685 17.2962 12.1511 17.1412 12.1789 16.9911C12.2068 16.8409 12.2788 16.7025 12.3856 16.5934C12.4925 16.4843 12.6294 16.4096 12.779 16.3786C12.9285 16.3477 13.0838 16.3619 13.2252 16.4196C13.3666 16.4773 13.4876 16.5758 13.5728 16.7026C13.658 16.8293 13.7035 16.9785 13.7035 17.1312C13.7052 17.3329 13.6269 17.5271 13.4857 17.6712C13.3446 17.8152 13.1521 17.8975 12.9504 17.9Z"
                      fill=""
                    />
                  </svg>
                </span>
                Add new
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md rounded-b-lg">
        <div>
          <div className="flex md:flex-row flex-col gap-x-5 gap-y-1 bg-white dark:bg-meta-4">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0  flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-graydark dark:text-white opacity-[0.5]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e: ChangeEvent) => setSearch(e.target.value)}
                id="table-search-users"
                className="py-[10px] pl-10 text-sm border rounded md:w-80 w-full outline-none focus:border-primary dark:bg-form-input dark:border-form-strokedark dark:placeholder-[#999898]"
                placeholder="Search"
              />
            </div>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <i className="fa-solid fa-bars-progress opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>
              <select
                value={categoryId}
                onChange={(e: ChangeEvent) => setCategoryId(e.target.value)}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                <option value="-1">Choose category</option>
                {categories.length > 0 &&
                  categories.map(
                    (elem: { id: number; name: string; img: string }) => {
                      return (
                        <option key={elem.id} value={elem.id}>
                          {elem.name}
                        </option>
                      );
                    },
                  )}
              </select>
              <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
            <div className="relative z-20 bg-white dark:bg-form-input">
              <i className="fa-solid fa-bars-progress opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>
              <select
                value={categoryId}
                onChange={(e: ChangeEvent) => setCategoryId(e.target.value)}
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                <option value="">Choose Brands</option>
                {brands.length > 0 &&
                  brands.map(
                    (elem: { id: number; name: string; img: string }) => {
                      return (
                        <option key={elem.id} value={elem.id}>
                          {elem.name}
                        </option>
                      );
                    },
                  )}
              </select>
              <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Brand
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map(
                (item: {
                  name: string;
                  categoryId: number;
                  subCategoryId: number;
                  brandId: number;
                  price: number;
                  discount: number;
                  hasDiscount: boolean;
                  isNew: boolean;
                  properties: any[];
                  media: any[];
                }) => {
                  return (
                    <tr
                      key={item.id}
                      className="bg-white border-b dark:bg-meta-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td
                        scope="row"
                        className="flex md:flex-row flex-col items-center md:px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={
                            import.meta.env.VITE_APP_FILES_URL +
                            item.media[0].src
                          }
                          alt="Jese image"
                        />
                        <div className="pl-3">
                          <div className="md:font-semibold text-[12px]">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {categories.find((e) => e.id == item.categoryId)?.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {brands.find((e) => e.id == item.brandId)?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-x-2">
                          <button className="hover:text-primary">
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                fill=""
                              />
                              <path
                                d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                fill=""
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setIdx(item.id);
                              dispatch(
                                handleChangeModal({
                                  name: 'deleteModal',
                                  value: true,
                                }),
                              );
                            }}
                            className="hover:text-primary"
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                fill=""
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                fill=""
                              />
                              <path
                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                fill=""
                              />
                              <path
                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                fill=""
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              UpdateModal(item);
                            }}
                            className="inline-flex dark:bg-meta-4 bg-[#eeeeee] items-center p-2 hover:bg-[#e9e9e9] dark:hover:bg-[#3f4b57]  rounded-[50%] justify-center text-center font-medium text-white hover:bg-opacity-90"
                          >
                            <i className="fa-solid fa-pen text-[12px] text-meta-4 dark:text-white"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
          </tbody>
        </table>
      </div>

      {/* modals */}
      <Dialog
        className="dark:bg-graydark"
        open={deleteModal}
        handler={() =>
          dispatch(handleChangeModal({ name: 'deleteModal', value: false }))
        }
      >
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            <h1 className="dark:text-whiten">Your Attention is Required!</h1>
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            className="mx-auto w-[50px] dark:text-[#e34545]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <Typography color="red" variant="h4">
            <h1 className="dark:text-whiten py-5 text-[20px]">
              Are you sure you want to delete this product?
            </h1>
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="gradient"
            className="dark:text-whiten "
            color="blue-gray"
            onClick={() =>
              dispatch(handleChangeModal({ name: 'deleteModal', value: false }))
            }
          >
            close
          </Button>
          <Button
            onClick={async () => {
              await delProduct(idx);
              dispatch(
                handleChangeModal({ name: 'deleteModal', value: false }),
              );
            }}
            variant="gradient"
            className="dark:text-whiten "
            color="blue-gray"
          >
            Ok, Got it
          </Button>
        </DialogFooter>
      </Dialog>
      {/* editModal */}

      <Dialog
        open={editModal}
        size="xxl"
        handler={() =>
          dispatch(handleChangeModal({ name: 'editModal', value: false }))
        }
        className="dark:bg-boxdark min-h-screen"
      >
        <DialogHeader className="dark:text-whiter">
          <div className="w-full flex justify-between items-center dark:border-graydark">
            <h3 className="font-bold text-gray-800 dark:text-white">
              Update Product
            </h3>
            <button
              onClick={() =>
                dispatch(handleChangeModal({ name: 'editModal', value: false }))
              }
              type="button"
              className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
              // data-hs-overlay="#hs-full-screen-modal"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3.5 h-3.5"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="border-y dark:border-y-graydark border-y-whiter h-[90vh] overflow-y-auto">
          <div>
            <div className="flex lg:flex-row flex-col gap-5.5 sm:p-6.5 p-0">
              <div className="flex flex-col gap-5">
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent) => setName(e.target.value)}
                  placeholder="Product Name"
                  className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e: ChangeEvent) => setFile(e.target.files)}
                  className=" cursor-pointer rounded border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter  file:py-2 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <i className="fa-solid fa-bars-progress opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>

                  <select
                    value={categoryId}
                    onChange={(e: ChangeEvent) => setCategoryId(e.target.value)}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="-1">Choose category</option>
                    {categories.length > 0 &&
                      categories.map(
                        (elem: { id: number; name: string; img: string }) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.name}
                            </option>
                          );
                        },
                      )}
                  </select>
                  <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <i className="fa-solid fa-inbox opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>
                  <select
                    value={subCategoryId}
                    onChange={(e: ChangeEvent) =>
                      setSubCategoryId(e.target.value)
                    }
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="-1">Choose SubCategory</option>
                    {subcategories.length > 0 &&
                      subcategories.map(
                        (elem: { id: number; name: string; img: string }) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.name}
                            </option>
                          );
                        },
                      )}
                  </select>
                  <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <i className="fa-solid fa-vector-square opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>
                  <select
                    value={brandId}
                    onChange={(e: ChangeEvent) => setBrandId(e.target.value)}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="-1">Choose Brands</option>
                    {brands.length > 0 &&
                      brands.map(
                        (elem: { id: number; name: string; img: string }) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.name}
                            </option>
                          );
                        },
                      )}
                  </select>
                  <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Price"
                  value={price}
                  onChange={(e: ChangeEvent) => setPrice(e.target.value)}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <div>
                  <label
                    htmlFor="toggle3"
                    className="inline-flex gap-x-5 cursor-pointer select-none items-center"
                  >
                    Diskout:
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="toggle3"
                        checked={hasDiscount}
                        className="sr-only"
                        onChange={() => {
                          setHasDiscount(!hasDiscount);
                        }}
                      />
                      <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                          hasDiscount &&
                          '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                        }`}
                      >
                        <span className={`hidden ${hasDiscount && '!block'}`}>
                          <svg
                            className="fill-white dark:fill-black"
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill=""
                              stroke=""
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                        <span className={`${hasDiscount && 'hidden'}`}>
                          <svg
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
                {hasDiscount && (
                  <input
                    type="number"
                    value={discount}
                    onChange={(e: ChangeEvent) => setDiscount(e.target.value)}
                    placeholder="Procent"
                    className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                )}
                <div>
                  <label
                    htmlFor="toggle4"
                    className="inline-flex gap-x-5 cursor-pointer select-none items-center"
                  >
                    isNew:
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="toggle4"
                        checked={isNew}
                        className="sr-only"
                        onChange={() => {
                          setIsNew(!isNew);
                        }}
                      />
                      <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                          isNew &&
                          '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                        }`}
                      >
                        <span className={`hidden ${isNew && '!block'}`}>
                          <svg
                            className="fill-white dark:fill-black"
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill=""
                              stroke=""
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                        <span className={`${isNew && 'hidden'}`}>
                          <svg
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="scrollprop flex flex-wrap gap-4 items-start max-h-[65vh] overflow-y-auto">
                {properties.map((elem) => {
                  return (
                    <div
                      className=""
                      key={elem.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 5 }}>
                        <input
                          type="text"
                          value={elem.name}
                          onChange={(e) => {
                            const copy = [
                              ...properties.map((item) => {
                                if (item.id === elem.id) {
                                  item.name = e.target.value;
                                }
                                return item;
                              }),
                            ];
                            setProperties(copy);
                          }}
                          placeholder="name"
                          className=" rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <button
                          onClick={() => {
                            const copy = [
                              ...properties.filter(
                                (item) => item.id !== elem.id,
                              ),
                            ];
                            setProperties(copy);
                          }}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                      <FormBuilder
                        properties={elem.properties}
                        key={elem.id}
                        fieldChange={(values) => {
                          const prop = {
                            ...properties.find((el) => el.id === elem.id),
                          };
                          prop.properties = values;

                          const copy = [
                            ...properties.map((el) => {
                              if (el.id === prop.id) {
                                return prop;
                              }
                              return el;
                            }),
                          ];
                          setProperties(copy);
                        }}
                      />
                    </div>
                  );
                })}
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      let obj = {
                        id: new Date().getTime(),
                        name: '',
                        properties: [],
                      };
                      const copy = [...properties, obj];
                      setProperties(copy);
                    }}
                    className="flex items-center justify-center rounded-md border border-meta-3 py-[8px] px-10 text-center font-medium text-meta-3 hover:bg-opacity-90"
                  >
                    Add field
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center gap-x-5 pt-[20px] dark:bg-boxdark bg-white">
          <Button
            variant="gradient"
            color="blue-gray"
            onClick={() =>
              dispatch(handleChangeModal({ name: 'editModal', value: false }))
            }
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={onSubmitUpdate}>
            <span>Update</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* addModal */}

      <Dialog
        open={addModal}
        size="xxl"
        handler={() =>
          dispatch(handleChangeModal({ name: 'addModal', value: false }))
        }
        className="dark:bg-boxdark min-h-screen"
      >
        <DialogHeader className="dark:text-whiter">
          <div className="w-full flex justify-between items-center dark:border-graydark">
            <h3 className="font-bold text-gray-800 dark:text-white">
              Add Product
            </h3>
            <button
              onClick={() =>
                dispatch(handleChangeModal({ name: 'addModal', value: false }))
              }
              type="button"
              className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
              // data-hs-overlay="#hs-full-screen-modal"
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3.5 h-3.5"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="border-y dark:border-y-graydark border-y-whiter h-[90vh] overflow-y-auto">
          <div>
            <div className="flex lg:flex-row flex-col gap-5.5 sm:p-6.5 p-0">
              <div className="flex flex-col gap-5">
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent) => setName(e.target.value)}
                  placeholder="Product Name"
                  className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e: ChangeEvent) => setFile(e.target.files)}
                  className=" cursor-pointer rounded border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter  file:py-2 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <i className="fa-solid fa-bars-progress opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>

                  <select
                    value={categoryId}
                    onChange={(e: ChangeEvent) => setCategoryId(e.target.value)}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="-1">Choose category</option>
                    {categories.length > 0 &&
                      categories.map(
                        (elem: { id: number; name: string; img: string }) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.name}
                            </option>
                          );
                        },
                      )}
                  </select>
                  <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <i className="fa-solid fa-inbox opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>
                  <select
                    value={subCategoryId}
                    onChange={(e: ChangeEvent) =>
                      setSubCategoryId(e.target.value)
                    }
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="-1">Choose SubCategory</option>
                    {subcategories.length > 0 &&
                      subcategories.map(
                        (elem: { id: number; name: string; img: string }) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.name}
                            </option>
                          );
                        },
                      )}
                  </select>
                  <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <i className="fa-solid fa-vector-square opacity-[0.5] absolute top-1/2 left-4 z-30 -translate-y-1/2"></i>
                  <select
                    value={brandId}
                    onChange={(e: ChangeEvent) => setBrandId(e.target.value)}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="-1">Choose Brands</option>
                    {brands.length > 0 &&
                      brands.map(
                        (elem: { id: number; name: string; img: string }) => {
                          return (
                            <option key={elem.id} value={elem.id}>
                              {elem.name}
                            </option>
                          );
                        },
                      )}
                  </select>
                  <span className="absolute top-1/2 z-999 right-[10px] -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill="#637381"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Price"
                  value={price}
                  onChange={(e: ChangeEvent) => setPrice(e.target.value)}
                  className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                <div>
                  <label
                    htmlFor="toggle3"
                    className="inline-flex gap-x-5 cursor-pointer select-none items-center"
                  >
                    Diskout:
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="toggle3"
                        checked={hasDiscount}
                        className="sr-only"
                        onChange={() => {
                          setHasDiscount(!hasDiscount);
                        }}
                      />
                      <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                          hasDiscount &&
                          '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                        }`}
                      >
                        <span className={`hidden ${hasDiscount && '!block'}`}>
                          <svg
                            className="fill-white dark:fill-black"
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill=""
                              stroke=""
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                        <span className={`${hasDiscount && 'hidden'}`}>
                          <svg
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
                {hasDiscount && (
                  <input
                    type="number"
                    value={discount}
                    onChange={(e: ChangeEvent) => setDiscount(e.target.value)}
                    placeholder="Procent"
                    className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                )}
                <div>
                  <label
                    htmlFor="toggle4"
                    className="inline-flex gap-x-5 cursor-pointer select-none items-center"
                  >
                    isNew:
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="toggle4"
                        checked={isNew}
                        className="sr-only"
                        onChange={() => {
                          setIsNew(!isNew);
                        }}
                      />
                      <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                          isNew &&
                          '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                        }`}
                      >
                        <span className={`hidden ${isNew && '!block'}`}>
                          <svg
                            className="fill-white dark:fill-black"
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill=""
                              stroke=""
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                        <span className={`${isNew && 'hidden'}`}>
                          <svg
                            className="h-4 w-4 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="scrollprop flex flex-wrap gap-4 items-start max-h-[65vh] overflow-y-auto">
                {properties.map((elem) => {
                  return (
                    <div
                      className=""
                      key={elem.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 5 }}>
                        <input
                          type="text"
                          value={elem.name}
                          onChange={(e) => {
                            const copy = [
                              ...properties.map((item) => {
                                if (item.id === elem.id) {
                                  item.name = e.target.value;
                                }
                                return item;
                              }),
                            ];
                            setProperties(copy);
                          }}
                          placeholder="name"
                          className=" rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <button
                          onClick={() => {
                            const copy = [
                              ...properties.filter(
                                (item) => item.id !== elem.id,
                              ),
                            ];
                            setProperties(copy);
                          }}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                      <FormBuilder
                        key={elem.id}
                        fieldChange={(values) => {
                          setProperties((prev) => [
                            ...prev.map((item) => {
                              if (item.id === elem.id) {
                                item.properties = values;
                              }
                              return item;
                            }),
                          ]);
                        }}
                      />
                    </div>
                  );
                })}
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      let obj = {
                        id: new Date().getTime(),
                        name: '',
                        properties: [],
                      };
                      const copy = [...properties, obj];
                      setProperties(copy);
                    }}
                    className="flex items-center justify-center rounded-md border border-meta-3 py-[8px] px-10 text-center font-medium text-meta-3 hover:bg-opacity-90"
                  >
                    Add field
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center gap-x-5 pt-[20px] dark:bg-boxdark bg-white">
          <Button
            variant="gradient"
            color="blue-gray"
            onClick={() =>
              dispatch(handleChangeModal({ name: 'addModal', value: false }))
            }
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={onSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Products;
