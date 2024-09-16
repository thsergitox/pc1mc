interface Props {
    handle: (type: string) => void
    options: { derivadas: string; hessiana: string; bracketing: string; }
}

export default Props