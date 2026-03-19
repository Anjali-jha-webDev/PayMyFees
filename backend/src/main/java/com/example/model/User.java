package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
    private String role;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = true)
    // NOTE: @JsonIgnore removed — Course already ignores its courseFees list,
    // so there is no circular reference. Admin needs course name in the response.
    private Course course;

    public User() {}

    public Long   getId()       { return id;       }
    public String getUsername() { return username;  }
    public String getEmail()    { return email;     }
    public String getPassword() { return password;  }
    public String getRole()     { return role;      }
    public Course getCourse()   { return course;    }

    public void setId(Long id)         { this.id       = id;       }
    public void setUsername(String u)  { this.username = u;        }
    public void setEmail(String e)     { this.email    = e;        }
    public void setPassword(String p)  { this.password = p;        }
    public void setRole(String r)      { this.role     = r;        }
    public void setCourse(Course c)    { this.course   = c;        }
}