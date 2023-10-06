import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./styles.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

type Inputs = {
  search: string;
};

interface FormProps {
  setCSVData: Dispatch<SetStateAction<any[]>>;
}

export default function Form({ setCSVData }: FormProps) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const search = formData.search;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users?q=${search}`
      );

      const { data } = response.data;

      setCSVData(data);

      toast.success("CSV filtered successfully");
      reset({ search: "" });
    } catch (error) {
      toast.error("Ops... some error occurred");
    }
  };

  return (
    <form className={styles.listCSVForm} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.listCSVlabel} htmlFor="searchInput">
        <input
          className={styles.listCSVInput}
          id="searchInput"
          type="text"
          placeholder="Type something to filter the data"
          {...register("search")}
        />
      </label>

      <button className={styles.listCSVButton} type="submit">
        Filter
      </button>
    </form>
  );
}
