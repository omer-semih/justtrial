using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoRepository _repo;

        // Repository, dependency injection ile geliyor
        public TodoController(TodoRepository repo)
        {
            _repo = repo;
        }

        // GET api/todo
        [HttpGet]
        public IEnumerable<TodoItem> Get() => _repo.GetAll();

        // GET api/todo/{id}
        [HttpGet("{id}")]
        public ActionResult<TodoItem> Get(int id)
        {
            var item = _repo.Get(id);
            if (item == null) return NotFound();
            return item;
        }

        // POST api/todo
        [HttpPost]
        public ActionResult<TodoItem> Post([FromBody] TodoItem item)
        {
            var added = _repo.Add(item);
            return CreatedAtAction(nameof(Get), new { id = added.Id }, added);
        }

        // PUT api/todo/{id}
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] TodoItem item)
        {
            item.Id = id;
            if (!_repo.Update(item)) return NotFound();
            return NoContent();
        }

        // DELETE api/todo/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!_repo.Delete(id)) return NotFound();
            return NoContent();
        }
    }
}