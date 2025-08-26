using TodoApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace TodoApi.Repositories
{
public class TodoRepository
{
    private readonly List<TodoItem> _todos = new();
    private static int _nextId = 1;  // <<< static yapıldı

    public IEnumerable<TodoItem> GetAll() => _todos;

    public TodoItem? Get(int id) => _todos.FirstOrDefault(t => t.Id == id);

    public TodoItem Add(TodoItem item)
    {
        item.Id = _nextId++;
        _todos.Add(item);
        return item;
    }

    public bool Update(TodoItem item)
    {
        var existing = Get(item.Id);
        if (existing == null) return false;

        existing.Title = item.Title;
        existing.IsCompleted = item.IsCompleted;
        return true;
    }

    public bool Delete(int id)
    {
        var existing = Get(id);
        if (existing == null) return false;

        _todos.Remove(existing);
        return true;
    }
}
}