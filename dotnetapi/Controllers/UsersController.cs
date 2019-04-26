using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapi.Controllers
{
    public class User
    {
        public string ID, Firstname, Lastname;
        public double Key;

        public User(string ID, string Firstname, string Lastname)
        {
            this.ID=ID;
            this.Firstname=Firstname;
            this.Lastname=Lastname;
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private User[] users = new User[] {
            new User("1","Test","User1"),
            new User("2","Test","User2"),
            new User("3","Test","User3")
        };

        public readonly int numUsers = 3;
        public Random random = new Random();

        public UsersController()
        {
        }

        // GET api/values
        [HttpGet]
        public ActionResult<User[]> Get()
        {
            for (int i = 0; i < numUsers; i++) {
                users[i].Key=random.NextDouble();
            }
            return users;
        }
    }
}
