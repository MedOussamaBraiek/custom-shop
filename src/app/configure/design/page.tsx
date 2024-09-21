import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator1 from "./DesignConfigurator1";
import DesignConfigurator2 from "./DesignConfiguration2";

const page = async () => {
  return <DesignConfigurator2 />;
};

export default page;
