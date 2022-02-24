import React from "react";
import Link from "./Link";
import { useQuery, gql } from "@apollo/client";

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        description
        postedBy {
          id
          name
        }
        voters {
          id
        }
      }
    }
  }
`;

const LinkList = () => {
  const { data, loading, error } = useQuery(FEED_QUERY);

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Failed to load link list</div>;
  }

  return (
    <div>
      {data && (
        <>
          {data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;
