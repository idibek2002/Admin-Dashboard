import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from '@material-tailwind/react';
import { singleFile } from '../api/api';
const TABLE_HEAD = ['SubCategory', 'Category', 'Brands', 'Actions'];

import {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoriesQuery,
  usePutSubCategoryMutation,
} from '../api/subcategory';
import Breadcrumb from '../components/Breadcrumb';
import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleChangeModal } from '../reducers/modals';
import { useGetCategoryQuery } from '../api/category';
import { useGetBrandsQuery } from '../api/brands';
import Select from 'react-tailwindcss-select';
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
  img: string;
  brands:[];
  categoryId: number;
};
const SubCategory = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [file, setFile] = useState('');
  const [editFile, setFileEdit] = useState('');
  const [idx, setIdx] = useState<number>(0);
  const { data = [] } = useGetSubCategoriesQuery('');
  const [addSubCategory] = useAddSubCategoryMutation();
  const [delSubCategory] = useDeleteSubCategoryMutation();
  const [editSubCategory] = usePutSubCategoryMutation();
  const options = useSelector(({ subcategory }) => subcategory.options);
  const deleteModal = useSelector(({ modals }) => modals.modal.deleteModal);
  const editModal = useSelector(({ modals }) => modals.modal.editModal);
  const { data: categories = [] } = useGetCategoryQuery('');
  const { data: brands = [] } = useGetBrandsQuery('');
  const [value, setValue] = useState('-1');
  const [value1, setValue1] = useState([]);

  const UpdateModal = (subcategory: Inputs) => {
    setName(subcategory.name);
    setIdx(subcategory.id);
    setFileEdit(subcategory.img);
    setValue1(subcategory.brands)

    dispatch(handleChangeModal({ name: 'editModal', value: true }));
  };

  const resetForm=()=>{
    setName('')
    setFile('')
    setFileEdit('')
    setValue1([])
  }
  const onSubmitUpdate = async () => {
    const obj = {
      id: idx,
      name,
    };
    if (file.length == 0) {
      editBrand({ ...obj, img: editFile });
    } else {
      const formData = new FormData();
      formData.append('file', file);
      const image = await singleFile(formData);
      editBrand({
        id:idx,
        name: name,
        img: image.img,
      });
      }
      resetForm();
      dispatch(handleChangeModal({ name: 'editModal', value: false }));
    }
  return (
    <>
      <Breadcrumb pageName="SubCategory" />
      <div>
        <div className="flex flex-col gap-5.5 sm:p-6.5 p-0">
          <div className="flex flex-col items-center gap-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <input
              type="file"
              onChange={(e: ChangeEvent) => setFile(e.target.files[0])}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter  file:py-5 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="relative z-20 w-full rounded border border-stroke p-4 px-10 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
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
            {brands.length > 0 && (
              <Select
                value={value1}
                isMultiple={true}
                onChange={(value) => {
                  setValue1(value);
                }}
                options={options}
              />
            )}
            <div className="flex justify-end w-full pb-4">
              <button
                onClick={async () => {
                  if (!file) return alert('Please select a file');
                  if (!name) return alert('Please write category');
                  const formData = new FormData();
                  formData.append('file', file);
                  const avatar = await singleFile(formData);
                  const arr = [];
                  for (const v of value1) {
                    arr.push(v.value);
                  }
                  addSubCategory({
                    name: name,
                    img: avatar.img,
                    brands: arr,
                    categoryId: Number(value),
                  });
                  setFile('');
                  setName('');
                  setValue1([]);
                  setValue('');
                }}
                className="sm:inline-flex flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-5 sm:px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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

      <Card className="h-full w-full dark:bg-graydark">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-graydark"
        >
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
           
            <div className="flex w-full shrink-0 pt-2 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input label="Search" className="dark:text-whiten" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0 dark:bg-graydark">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="dark:bg-graydark">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 dark:border-[#7f7f7f] p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 dark:text-whiten"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(
                (item: {
                  id: number;
                  name: string;
                  img: string;
                  brands: [];
                  categoryId: number;
                }) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3 p-3">
                          <Avatar
                            variant="circular"
                            alt={item.name}
                            className="border-2 border-white hover:z-10 focus:z-10"
                            src={import.meta.env.VITE_APP_FILES_URL + item.img}
                          />

                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold dark:text-whiten"
                          >
                            {item.name}
                          </Typography>
                        </div>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal pl-4 dark:text-whiten"
                        >
                          {
                            categories.find(
                              (e: { id: number }) => e.id === item.categoryId,
                            )?.name
                          }
                        </Typography>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="rounded-md p-1">
                            <div className="flex items-center -space-x-4">
                              <Avatar
                                variant="circular"
                                alt="user 1"
                                className="border-2 dark:border-boxdark hover:z-10 focus:z-10 w-10 h-10"
                                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Tooltip content="Edit">
                          <IconButton variant="text" 
                           onClick={() => {
                            dispatch(
                              handleChangeModal({
                                name: 'editModal',
                                value: true,
                              }),
                            );
                            setIdx(item.id);
                            setNameEdit(item.name);
                            setFileEdit(item.img);
                          }}>
                            <i className="fa-solid fa-pen text-[12px] text-meta-4 dark:text-white"></i>
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <IconButton variant="text" 
                          onClick={() => {
                            dispatch(
                              handleChangeModal({
                                name: 'deleteModal',
                                value: true,
                              }),
                            );
                            setIdx(item.id);
                          }}>
                          <i className="fa-solid fa-trash text-[12px] text-meta-4 dark:text-white"></i>
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-100 dark:border-[#7f7f7f] p-4">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" size="sm">
              1
            </IconButton>
            <IconButton variant="text" size="sm">
              2
            </IconButton>
            <IconButton variant="text" size="sm">
              3
            </IconButton>
            <IconButton variant="text" size="sm">
              ...
            </IconButton>
            <IconButton variant="text" size="sm">
              8
            </IconButton>
            <IconButton variant="text" size="sm">
              9
            </IconButton>
            <IconButton variant="text" size="sm">
              10
            </IconButton>
          </div>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </CardFooter>
      </Card>
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
              Are you sure you want to delete this SubCategory?
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
              await delSubCategory(idx);
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


      <Dialog
        open={editModal}
        handler={() =>{
          dispatch(handleChangeModal({ name: 'editModal', value: false }))
          resetForm()
        }
        }
        className="dark:bg-boxdark "
      >
        <DialogHeader className="flex items-center justify-between">
          <h1 className="text-[20px] dark:text-whiten">Update Brand</h1>
          <button
            onClick={() =>{
              dispatch(handleChangeModal({ name: 'editModal', value: false }))
              resetForm()
            }
            }
          >
            <i className="fa-solid fa-close text-lg dark:text-whiten"></i>
          </button>
        </DialogHeader>
        <DialogBody>
          <div className="relative rounded-lg shadow w-full px-6">
            <div className="flex flex-col items-center gap-y-5 w-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              <input
                type="file"
                onChange={(e: ChangeEvent) => setFile(e.target.files[0])}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter  file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center gap-x-3">
          <Button
            variant="gradient"
            onClick={() =>{
              dispatch(handleChangeModal({ name: 'editModal', value: false }))
              resetForm()
            }
            }
            className="mr-1 bg-primary"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={onSubmitUpdate}>
            <span>Update</span>
          </Button>
        </DialogFooter>
      </Dialog>
     
      {/* {editModal && (
        <div className="flex items-center justify-center top-0 left-0 fixed z-99999 w-[100%] h-screen">
          <div className="flex items-center w-[50%] p-4 relative z-50 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-h-full">
              <div className="relative bg-white rounded-lg shadow w-full dark:bg-boxdark px-6">
                <div className="flex items-center justify-between">
                  <h1 className="py-6 text-[20px]">Edit Category</h1>
                  <button
                    onClick={() =>
                      dispatch(
                        handleChangeModal({ name: 'editModal', value: false }),
                      )
                    }
                  >
                    <i className="fa-solid fa-close text-lg"></i>
                  </button>
                </div>
                <div className="flex flex-col items-center gap-y-5 w-full">
                  <input
                    type="text"
                    value={nameEdit}
                    onChange={(e) => setNameEdit(e.target.value)}
                    placeholder="Category Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <input
                    type="file"
                    onChange={(e: ChangeEvent) => setFile(e.target.files[0])}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter  file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />
                  <div className="flex justify-end w-full pb-4 gap-x-5">
                    <button
                      onClick={() =>
                        dispatch(
                          handleChangeModal({
                            name: 'editModal',
                            value: false,
                          }),
                        )
                      }
                      className="sm:inline-flex flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-5 sm:px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!file) {
                          editSubCategory({
                            id: idx,
                            name: nameEdit,
                            img: fileEdit,
                          });
                        } else {
                          const formData = new FormData();
                          formData.append('file', file);
                          const avatar = await singleFile(formData);
                          editSubCategory({
                            id: idx,
                            name: nameEdit,
                            img: avatar.img,
                          });
                        }
                        setNameEdit('');
                        setFileEdit('');
                        setFile('');
                        dispatch(
                          handleChangeModal({
                            name: 'editModal',
                            value: false,
                          }),
                        );
                      }}
                      className="sm:inline-flex flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-5 sm:px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default SubCategory;
