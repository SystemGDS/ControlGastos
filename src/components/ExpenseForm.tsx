/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useState, useEffect } from "react";
import { DraftExpense, Value } from "../types";
import { categories } from "../db/categories";
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hook/useBudget";


export default function ExpenseForm() {
    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date,
    })
    const [error, setError] = useState('')
    const [previewAmount, setPreviewAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()
    
    useEffect(() => {
        if (state.editingId){
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviewAmount(editingExpense.amount)
        }
    }, [state.editingId])


    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) =>{
        const { name, value} = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? Number(value) : value
        })
    }
    

    const handleChangeDate = (value: Value) =>{
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //Valid
        if(Object.values(expense).includes('')){
            setError('Todos los campos son Obligatorios')
            return
        }
        //Valid que no me pase del Limite
        if((expense.amount - previewAmount)> remainingBudget){
            setError('El gasto excede el Limite')
            return
        }
        //Agregar un nuevo gasto o actualizar gasto
        if(state.editingId){
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        }else{
            dispatch({type:'add-expense', payload:{ expense  }})
        }
        //Reiniciar el State
        setExpense({
            amount: 0,
            expenseName: '',
            category:'',
            date: new Date()
        })
        setPreviewAmount(0)
    }
  return (
    <form className="" onSubmit={handleSubmit}>
        <legend
            className="uppercase text-center text-2xl font-black border-b-4 border-blue-600 py-2"
        >
            {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
        </legend>
        {error && <ErrorMessage>{error}</ErrorMessage> }
        <div className="flex flex-col gap-2 p-2">
            <label 
                htmlFor="expenseName"
                className="text-xl gap-2"
            >
                Nombre Gasto:
            </label>
            <input 
                id="expenseName"
                type="text" 
                placeholder="Añade el nombre del Gasto"
                className="bg-slate-100 p-2"
                name="expenseName"
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2 p-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >
                Cantidad:
            </label>
            <input 
                id="amount"
                type="number" 
                placeholder="Añade la cantidad del Gasto. Ej: 300"
                className="bg-slate-100 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2 p-2">
            <label 
                htmlFor="category"
                className="text-xl"
            >
                Categoria:
            </label>
            <select 
                id="category"
                className="bg-slate-100 p-2"                
                name="category"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">--Seleccione--</option>
                {categories.map(category => (
                    <option 
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
        <div className="flex flex-col gap-2 p-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >
                Fecha Gasto:
            </label>
            <DatePicker 
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>
        <input 
            type="submit" 
            className="bg-blue-600 gap-2 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId ? 'Guardar Cambios':'Registrar Gasto'}
        />
    </form>
  )
}
