import JobBlock from "../../src/components/JobBlock/JobBlock";
import TagBlock from "../../src/components/Tag/Tag";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

const SearchPage = () => {
    const [state, setState] = useState([]);
    const [params] = useState(
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("search") || ""
            : "",
    );

    const asideStruct = {
        Categories: [
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
        "Job Type": ["Full Time", "Part Time"],
        "Salary Range": [
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
            Categories: form["Categories"].value,
            "Job Type": form["Job Type"].value,
            "Salary Range": form["Salary Range"].value,
            Search: params,
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
                                        {typeof window !== "undefined" && params && params.length > 0 && typeof params === 'string'
                                            ? params.split(" ").map((e, i) => (
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
                                {Object.keys(asideStruct).map((key, i) => (
                                    <ul key={i} className="mb-4">
                                        <Heading>Refine by {key}</Heading>
                                        {asideStruct[key].map((item, idx) => (
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
                                ))}
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
                                        className="block mb-4"
                                    >
                                        <div>
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