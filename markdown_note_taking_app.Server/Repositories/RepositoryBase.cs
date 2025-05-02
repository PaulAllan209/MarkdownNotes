using markdown_note_taking_app.Server.Data;
using markdown_note_taking_app.Server.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace markdown_note_taking_app.Server.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        protected DataContext _dataContext;

        public RepositoryBase(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public IQueryable<T> FindAll(bool trackChanges)
        {
            if(trackChanges)
                return _dataContext.Set<T>().AsTracking();
            else
                return _dataContext.Set<T>().AsNoTracking();
        }

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges)
        {
            if (trackChanges)
                return _dataContext.Set<T>().Where(expression).AsTracking();
            else
                return _dataContext.Set<T>().Where(expression).AsNoTracking();
        }
        public void Create(T entity)
        {
            _dataContext.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _dataContext.Set<T>().Remove(entity);
        }

        public void Update(T entity)
        {
            _dataContext.Set<T>().Update(entity);
        }
    }
}
