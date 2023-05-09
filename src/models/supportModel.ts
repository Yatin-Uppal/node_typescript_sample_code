import { DataTypes, Op, Sequelize, where } from "sequelize";
import db from "../helpers/databaseConfig";

class SupportModel {
  private support;
  private ticket_comments;
  private users;

  constructor() {
    this.support = db.define(
      "support_tickets",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        document_path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );
    this.ticket_comments = db.define(
      "support_tickets_comments",
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        support_ticket_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updated_by: {
          type: DataTypes.INTEGER,
        },
      },
      {
        timestamps: false,
      }
    );
    this.users = db.define("users", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			last_name: {
				type: DataTypes.STRING
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			},
			created_by: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE
			},
			updated_by: {
				type: DataTypes.INTEGER,
			},
		}, {
				timestamps: false
		});
    this.support.hasMany(this.ticket_comments, {
      foreignKey: "support_ticket_id",
      as: "ticket_comments",
    });
    this.ticket_comments.belongsTo(this.support, { foreignKey: "id" });

    this.users.hasOne(this.ticket_comments, {
      foreignKey: "id"
    });
    this.ticket_comments.belongsTo(this.users, {
      foreignKey: "user_id"
    });
  }
  
  public async getTicketsList(
    user_id: number,
    keyword: string,
    page: number,
    size: number,
    callback: Function
  ): Promise<any> {
    try {
      let check = false;
      const limit = size ? size : parseInt(process.env.DEFAULT_RECORDS_LIMIT);
      const offset =
        page > 1
          ? (page - 1) * limit
          : parseInt(process.env.DEFAULT_RECORDS_OFFSET);
      const queryCheck = keyword
        ? {
            where: {
              [Op.and]: [
                {
                  title: {
                    [Op.like]: `%${keyword}%`,
                  },
                  status: 1,
                },
              ],
            },
            include: [],
            distinct: true,
            order: [["id", "DESC"]],
            limit,
            offset,
          }
        : {
            where: {
                status: 1
            },
            distinct: true,
            order: [["id", "DESC"]],
            limit,
            offset,
          };
      let ticketsData = await this.support.findAndCountAll(queryCheck);
      ticketsData = JSON.parse(JSON.stringify(ticketsData));
      if (ticketsData === null) {
        check = true;
      }
      return callback(check, ticketsData, "SUPPORT0001");
    } catch (error) {
      return callback(true, null, "GEN0004");
    }
  }
  public async addTicket(ticket: any, callback: Function) {
    try {
        
            const ticketObj = await this.support.create({
                user_product_id: ticket.user_product_id,
                title: ticket.title,
                description: ticket.description,
                document_path: '',
                status: ticket.status,
                created_by: ticket.user_id,
                updated_by: ticket.user_id
            });
            return callback(false, ticketObj, "SUPPORT0002");
    } catch (error) {
        return callback(true, null, "GEN0004");
    }
}
public async saveTicketDocumentData(ticketId: number, file: any, callback: Function) {
    try {
        let check = false;
        const findTicket = await this.support.findOne({ where: { id: ticketId } });
        if (!findTicket) {
            check = !findTicket;
            return callback(check, null, "SUPPORT0008");
        } else {
            const documentData = await this.support.update({
                document_path : file
            }, {
                where: {
                    id: ticketId
                }
            });
            return callback(false, documentData, "SUPPORT0004");
        }
    } catch (error) {
        return callback(true, null, "GEN0004");
    }
}
public async saveComment(comment: any, callback: Function): Promise<any> {
  try {
    let error = false;
    const findTicket = await this.support.findOne({
      where: {
            id: comment.support_ticket_id,
      }
    });
    if (!findTicket) {
      error = !findTicket;
      return callback(error, "SUPPORT0008");
    } else {
    const commentObj = await this.ticket_comments.create({
      support_ticket_id: comment.support_ticket_id,
      comment: comment.comment,
      user_id: comment.user_id,
      created_by: comment.user_id
  });
  const findComment = await this.ticket_comments.findOne({
    where:{ 
      id: commentObj.id,
      support_ticket_id: commentObj.support_ticket_id
  }, include: [{
                model: this.users,
                as: "user",
                attributes: ["id", "first_name", "last_name", "email", "status"],
                where: {
                  status: 1
                },
                required: false
              }]})
  return callback(false, findComment, "SUPPORT0009");
}
} catch (error) {
return callback(true, null, "GEN0004");
}
}
  public async updateStatusAsResolved(
    supportTicketId: number,
    callback: Function
  ) {
    try {
      let error = false;
      const findTicket = await this.support.findOne({
        where: {
          [Op.and]: [
            {
              id: supportTicketId,
              status: 1,
            },
          ],
        },
      });
      if (!findTicket) {
        error = !findTicket;
        return callback(error, "SUPPORT0008");
      } else {
        await this.support.update(
          { status: 2 },
          {
            where: {
              [Op.and]: [
                {
                  id: supportTicketId,
                  status: 1,
                },
              ],
            },
          }
        );
        return callback(false, "SUPPORT0011");
      }
    } catch (error) {
      return callback(true, "GEN0004");
    }
  }
  public async getSupportTicketById(
    supportTicketId: number,
    callback: Function
  ) {
    try {
      let error = false;
      const findTicket = await this.support.findOne({
        where: {
          [Op.and]: [
            {
              id: supportTicketId,
              status: 1,
            },
          ],
        },
      });
      if (!findTicket) {
        error = !findTicket;
        return callback(error, null, "SUPPORT0008");
      } else {
        const check = await this.support.findOne(
          {
            where: {
              [Op.and]: [
                {
                  id: supportTicketId,
                  status: 1,
                },
              ],
            },
            required: false,
            include: [{
              model: this.ticket_comments,
              as: "ticket_comments",
              required: false,
              include: [{
                model: this.users,
                as: "user",
                attributes: ["id", "first_name", "last_name", "email", "status"],
                where: {
                  status: 1
                },
                required: false
              }]
            }]
          }
        );
        return callback(false, check, "SUPPORT0012");
      }
    } catch (error) {
      return callback(true, null, "GEN0004");
    }
  }
}
export default new SupportModel();