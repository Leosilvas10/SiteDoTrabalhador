import JobBlock from "../../src/components/JobBlock/JobBlock";
import TagBlock from "../../src/components/Tag/Tag";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Banner_1 } from "../../src/components/Banner/Banner";
import Heading from "../../src/components/Other/Heading.style";
import Button from "../../src/components/Buttons/Button";

const SearchPage = () => {
    const [state, setState] = useState([]);
    const [params] = useState(
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("search") || ""
            : ""
    );

    const asideStruct = {
        categories: [
            "Aviation",
            "Arts",
            "Business",
            "Law Enforcement",
            "Media",
            "Medical",
            "Service Industry",
            "Teaching",
            "Technology",
            "Other",
        ],
        jobType: ["Full Time", "Part Time"],
        salaryRange: [
            "Up to $20,000",
            "$20,000 - $40,000",
            "$40,000 - $75,000",
            "$75,000 - $100,000",
            "$100,000 - $150,000",
            "$150,000 - $200,000",
            "$200,000 - $300,000",
            "$300,000 - $500,000",
            "$500,000+",
        ],
    };

    const formHandler = (e) => {
        if (e) e.preventDefault();

        const form = document.forms["refine"];
        const data = {
            categories: form["categories"]?.value || "",
            jobType: form["jobType"]?.value || "",
            salaryRange: form["salaryRange"]?.value || "",
            search: params,
        };

        fetch("/api/get_jobs", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => {
                localStorage.setItem("vacancies", JSON.stringify(res));
                setState(res);
            });
    };

    useEffect(() => {
        formHandler();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {params ? (
                <Head>
                    <title>Job Search: {params}</title>
                </Head>
            ) : null}
            {state ? (
                <>
                    <Banner_1 found={state.length} />
                    <div className="flex gap-8 container mx-auto px-4 py-8">
                        {/* Aside */}
                        <aside className="w-80 p-4 bg-gray-50 rounded shadow">
                            <form name="refine">
                                <div className="mb-4">
                                    <Heading>Current Search</Heading>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {typeof window !== "undefined" &&
                                        params &&
                                        params.length > 0 &&
                                        typeof params === "string"
                                            ? params
                                                  .split(" ")
                                                  .map((e, i) => (
                                                      <TagBlock
                                                          key={i}
                                                          type="search"
                                                      >
                                                          {e}
                                                      </TagBlock>
                                                  ))
                                            : null}
                                    </div>
                                </div>
                                {Object.entries(asideStruct).map(
                                    ([key, items], i) => (
                                        <ul key={i} className="mb-4">
                                            <Heading>
                                                Refine by{" "}
                                                {key
                                                    .replace(/([A-Z])/g, " $1")
                                                    .replace(/^./, (str) =>
                                                        str.toUpperCase()
                                                    )}
                                            </Heading>
                                            {items.map((item, idx) => (
                                                <li key={idx} className="mb-1">
                                                    <label className="pl-4">
                                                        <input
                                                            className="mr-2 align-middle"
                                                            type="radio"
                                                            name={key}
                                                            value={item}
                                                        />
                                                        {item}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                )}
                                <Button onClick={formHandler} type="Apply">
                                    Submit
                                </Button>
                            </form>
                        </aside>

                        {/* Main */}
                        <main className="flex-1">
                            <Heading size="lg">Job Listing</Heading>
                            <div className="mt-8">
                                {state.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={`/ViewJobs/ViewJobs?id=${item.id}`}
                                        passHref
                                    >
                                        <div className="block mb-4 cursor-pointer">
                                            <JobBlock {...item} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </main>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default SearchPage;
