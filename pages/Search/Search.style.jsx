import styled from "styled-components";

export const SearchContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
`;

export const SearchHeader = styled.div`
  margin-bottom: 2rem;
`;

export const FilterContainer = styled.div`
  margin-bottom: 2rem;
`;

export const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const Sidebar = styled.aside`
  width: 320px;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

export const MainContent = styled.main`
  flex: 1;
`;

export const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

export const FilterItem = styled.li`
  margin-bottom: 0.5rem;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.25rem 0;

    input {
      margin-right: 0.5rem;
    }
  }
`;

export const SearchTitle = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;
