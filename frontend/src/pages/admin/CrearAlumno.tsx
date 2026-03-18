import { useState } from 'react'
import { createAlumno } from '../../services/alumno.service'
import { useNavigate } from 'react-router-dom'
import SidebarAdmin from '../../components/SidebarAdmin'
import '../../styles/crear_alumno.css'
export default function CrearAlumno() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ nombre: '', apellido: '', codigo: '' })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido'
        if (!form.apellido.trim()) errs.apellido = 'El apellido es requerido'
        if (!form.codigo.trim()) errs.codigo = 'El código es requerido'
        else if (!/^[a-zA-Z0-9\-_]+$/.test(form.codigo)) errs.codigo = 'Solo letras, números y guiones'
        return errs
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            await createAlumno(form)
            navigate('/admin/alumnos')
        } catch {
            setErrors({ general: 'Error al crear el alumno. Inténtalo de nuevo.' })
        } finally {
            setLoading(false)
        }
    }

    const initials = `${form.nombre?.[0] ?? ''}${form.apellido?.[0] ?? ''}`.toUpperCase()

    return (
        <>
            <div className="ca-root">
                <SidebarAdmin />

                <div className="ca-main">
                    {/* Topbar */}
                    <div className="ca-topbar">
                        <div className="ca-topbar-left">
                            <button className="back-btn" onClick={() => navigate('/admin/alumnos')} title="Volver">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <div>
                                <h1><i className="fa-solid fa-user-graduate"></i> Crear Alumno</h1>
                                <p>Registra un nuevo estudiante en el sistema</p>
                            </div>
                        </div>
                    </div>

                    <div className="ca-content">
                        <form className="ca-card" onSubmit={handleSubmit}>

                            {/* Live preview */}
                            <div className="avatar-preview">
                                <div className={`avatar-circle${initials ? ' filled' : ''}`}>
                                    {initials || <i className="fa-solid fa-user-graduate" style={{ fontSize: 22 }}></i>}
                                </div>
                                <div className="avatar-info">
                                    <div className={`avatar-name${!form.nombre && !form.apellido ? ' placeholder' : ''}`}>
                                        {form.nombre || form.apellido
                                            ? `${form.nombre} ${form.apellido}`.trim()
                                            : 'Nombre del alumno'}
                                    </div>
                                    <div className="avatar-sub">
                                        {form.codigo
                                            ? <><i className="fa-solid fa-id-card" style={{ marginRight: 5, opacity: 0.5 }}></i>{form.codigo.toUpperCase()}</>
                                            : 'Código de estudiante'
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Datos personales */}
                            <div className="form-section">
                                <div className="section-header">
                                    <i className="fa-solid fa-user"></i>
                                    <span>Datos personales</span>
                                </div>
                                <div className="section-body">
                                    <div className="field-row">
                                        <div className="input-group">
                                            <label className="input-label">
                                                <i className="fa-solid fa-font"></i> Nombre
                                            </label>
                                            <input
                                                className={`ca-input${errors.nombre ? ' error' : ''}`}
                                                name="nombre"
                                                placeholder="ej. María"
                                                value={form.nombre}
                                                onChange={handleChange}
                                            />
                                            {errors.nombre && <span className="error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.nombre}</span>}
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label">
                                                <i className="fa-solid fa-font"></i> Apellido
                                            </label>
                                            <input
                                                className={`ca-input${errors.apellido ? ' error' : ''}`}
                                                name="apellido"
                                                placeholder="ej. García"
                                                value={form.apellido}
                                                onChange={handleChange}
                                            />
                                            {errors.apellido && <span className="error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.apellido}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Código */}
                            <div className="form-section">
                                <div className="section-header">
                                    <i className="fa-solid fa-id-card"></i>
                                    <span>Identificación</span>
                                </div>
                                <div className="section-body">
                                    <div className="input-group">
                                        <label className="input-label">
                                            <i className="fa-solid fa-hashtag"></i> Código de alumno
                                        </label>
                                        <input
                                            className={`ca-input codigo${errors.codigo ? ' error' : ''}`}
                                            name="codigo"
                                            placeholder="ej. ALU-2024-001"
                                            value={form.codigo}
                                            onChange={handleChange}
                                        />
                                        {errors.codigo
                                            ? <span className="error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.codigo}</span>
                                            : <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                                                <i className="fa-solid fa-circle-info" style={{ marginRight: 5 }}></i>
                                                Solo letras, números y guiones. Se guardará en mayúsculas.
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* General error */}
                            {errors.general && (
                                <div className="general-error">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    {errors.general}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => navigate('/admin/alumnos')}>
                                    <i className="fa-solid fa-xmark" style={{ marginRight: 7 }}></i>Cancelar
                                </button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading
                                        ? <><i className="fa-solid fa-circle-notch spin"></i>Guardando...</>
                                        : <><i className="fa-solid fa-floppy-disk"></i>Guardar Alumno</>
                                    }
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}