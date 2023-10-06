"use client";

import Image from "next/image";
import styles from "./styles.module.css";

import { SiGoogledocs } from "react-icons/si";
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UploadCSVProps {
  setCSVData: Dispatch<SetStateAction<any[]>>;
}

export default function UploadCSV({ setCSVData }: UploadCSVProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = () => {
    fileInputRef.current?.click();
  };

  const handleCSV = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;

    if (file.type !== "text/csv") {
      toast.error("Only CSV files are accepted");
      return;
    }

    let formData = new FormData();

    let config = {
      headers: {
        "Content-Type": `text/csv`,
      },
    };

    try {
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/files`,
        formData,
        config
      );

      const { data } = response.data;

      setCSVData(data);

      toast.success("CSV saved successfully");
    } catch (error) {
      toast.error("Ops... some error occurred");
    }
  };

  return (
    <div className={styles.uploadCsvContainer}>
      <div className={styles.uploadCsvContainerImageAndTitle}>
        <Image
          src="/image-upload.svg"
          alt="Man catch the upload button"
          width={250}
          height={250}
        />
        <h1 className={styles.uploadCsvTitle}>Add a CSV File</h1>
      </div>

      <label
        className={styles.uploadCsvLabelButton}
        onClick={handleFileSelection}
      >
        Select a CSV
        <SiGoogledocs size={24} />
      </label>
      <input
        ref={fileInputRef}
        className={styles.uploadCsvButton}
        type="file"
        onChangeCapture={handleCSV}
      />

      <ToastContainer />
    </div>
  );
}
