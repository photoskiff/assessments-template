import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { CountriesTable } from "./CountriesTable";
import { sampleData } from './model/sampleData';
import userEvent from '@testing-library/user-event';

describe("countries table tests", () => {
    const getButton = (name: "desc" | "asc" | "reset") => screen.getByRole('button', { name })
    describe("initialization tests", () => {
        it("should show loading if no data", () => {
            render(<CountriesTable countries={undefined} />);
            const elem = screen.getByText(/loading\.\.\./i);
            expect(elem).toBeInTheDocument();
            expect(elem).toHaveTextContent("loading...");
        });
        it("should show in default state", () => {
            render(<CountriesTable countries={sampleData} />);
            expect(screen.getByText("Belgium")).toBeInTheDocument();
            expect(getButton("desc")).toBeEnabled();
            expect(getButton("reset")).toBeDisabled();
            expect(getButton("asc")).toBeEnabled();
            expect(screen.getByRole('textbox')).toHaveTextContent("");
            expect(screen.getByTestId("first-row")).toHaveTextContent("FRA");
        });
    });
    describe("sorting tests", () => {
        it("should sort ascending", () => {
            render(<CountriesTable countries={sampleData} />);
            fireEvent.click(getButton("asc"));
            expect(screen.getByTestId("first-row")).toHaveTextContent("GGY");
            expect(getButton("desc")).toBeEnabled();
            expect(getButton("reset")).toBeEnabled();
            expect(getButton("asc")).toBeDisabled();
        });
        it("should sort descending", () => {
            render(<CountriesTable countries={sampleData} />);
            fireEvent.click(getButton("desc"));
            expect(screen.getByTestId("first-row")).toHaveTextContent("RUS");
            expect(getButton("desc")).toBeDisabled();
            expect(getButton("reset")).toBeEnabled();
            expect(getButton("asc")).toBeEnabled();
        });

        it("should reset sorting", () => {
            render(<CountriesTable countries={sampleData} />);
            fireEvent.click(getButton("desc"));
            fireEvent.click(getButton("reset"));
            expect(screen.getByTestId("first-row")).toHaveTextContent("FRA");
            expect(getButton("desc")).toBeEnabled();
            expect(getButton("reset")).toBeDisabled();
            expect(getButton("asc")).toBeEnabled();
        });
    });

    describe("filtering tests", () => {
        it("should filter by name", async () => {
            render(<CountriesTable countries={sampleData} />);
            await waitFor(() => userEvent.type(screen.getByRole('textbox'), "f"));
            expect(screen.getByText("FRA")).toBeInTheDocument();
            expect(screen.getByText("RUS")).toBeInTheDocument();
            expect(screen.queryByText("BEL")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
            await waitFor(() => userEvent.type(screen.getByRole('textbox'), "fr"));
            expect(screen.getByText("FRA")).toBeInTheDocument();
            expect(screen.queryByText("RUS")).toBeNull();
            expect(screen.queryByText("BEL")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
        });

        it("should filter by alpha2", async () => {
            render(<CountriesTable countries={sampleData} />);
            const text = screen.getByRole('textbox');
            userEvent.type(text, "/");
            userEvent.type(screen.getByRole('textbox'), "f");
            expect(screen.getByText("FRA")).toBeInTheDocument();
            expect(screen.queryByText("RUS")).toBeNull();
            expect(screen.queryByText("BEL")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
        });

        it("should filter by alpha3", () => {
            render(<CountriesTable countries={sampleData} />);
            const text = screen.getByRole('textbox');
            userEvent.type(text, "/");
            userEvent.type(text, "/");
            userEvent.type(screen.getByRole('textbox'), "bel");
            expect(screen.getByText("BEL")).toBeInTheDocument();
            expect(screen.queryByText("RUS")).toBeNull();
            expect(screen.queryByText("FRA")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
        });
        it("should rotate filter selection forward and change prompt if typed '/'", () => {
            render(<CountriesTable countries={sampleData} />);
            const text = screen.getByRole('textbox');
            userEvent.type(text, "/");
            const combo = screen.getByRole('combobox');
            expect(combo).toHaveValue("alpha2Code");
            expect(screen.queryByPlaceholderText(/alpha2Code/i)).toBeInTheDocument();
            userEvent.type(text, "/");
            expect(combo).toHaveTextContent("alpha3Code");
            expect(screen.queryByPlaceholderText(/alpha3Code/i)).toBeInTheDocument();
        });
        it("should rotate filter selection backward and change prompt if typed '\\'", () => {
            render(<CountriesTable countries={sampleData} />);
            const text = screen.getByRole('textbox');
            userEvent.type(text, "\\");
            const combo = screen.getByRole('combobox');
            expect(combo).toHaveValue("currencies");
            expect(screen.queryByPlaceholderText(/currencies/i)).toBeInTheDocument();
            userEvent.type(text, "\\");
            expect(combo).toHaveTextContent("alpha3Code");
            expect(screen.queryByPlaceholderText(/alpha3Code/i)).toBeInTheDocument();
        });
        it.skip("should reset filter on escape key press", async () => {
            render(<CountriesTable countries={sampleData} />);
            var textbox = screen.getByRole('textbox');
            userEvent.type(textbox, "f");
            expect(screen.queryByText("BEL")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
            //can't make keyPress working for some reason
            fireEvent.focus(textbox);
            waitFor(() => fireEvent.keyPress(textbox, { key: 'Escape', keyCode: 27 }));
            // userEvent.type(textbox, "{esc}");
            expect(screen.queryByText("BEL")).toBeInTheDocument();
            expect(screen.queryByText("GGY")).toBeInTheDocument();
            expect(screen.getByText("FRA")).toBeInTheDocument();
            expect(screen.getByText("RUS")).toBeInTheDocument();
        });
    });

    describe("combined sorting & filtering tests", () => {
        it("should not lose sort when filtered", () => {
            render(<CountriesTable countries={sampleData} />);
            fireEvent.click(getButton("desc"));
            userEvent.type(screen.getByRole('textbox'), "f");
            expect(screen.queryByText("BEL")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
            expect(screen.getByTestId("first-row")).toHaveTextContent("RUS");
        });
        it("should not lose filter when sorted", () => {
            render(<CountriesTable countries={sampleData} />);
            userEvent.type(screen.getByRole('textbox'), "f");
            fireEvent.click(getButton("desc"));
            expect(screen.queryByText("BEL")).toBeNull();
            expect(screen.queryByText("GGY")).toBeNull();
            expect(screen.getByTestId("first-row")).toHaveTextContent("RUS");
        });
    });
    describe("popup tests", () => {
        it("should show correct popup when clicked on flag", () => {
            render(<CountriesTable countries={sampleData} />);
            const flag = screen.getByTestId(/fra/i);
            fireEvent.click(flag);
            fireEvent.click(screen.getByTestId("first-row"));
            expect(screen.getByRole('heading', {  name: /france/i})).toBeInTheDocument();
        });
        it("should close popup when clicked on close button", () => {
            render(<CountriesTable countries={sampleData} />);
            const flag = screen.getByTestId(/fra/i);
            fireEvent.click(flag);
            fireEvent.click(screen.getByTestId("popupCloser"));
            expect(screen.queryByRole('heading', { name: /france/i})).toBeNull();
        });
    })
})